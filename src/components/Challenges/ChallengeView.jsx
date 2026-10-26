import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getChallengeById, getNextChallengeId } from '../../data/challengesData';
import {
  loadLevelState,
  gitInit, gitAdd, gitCommit, gitBranch,
  gitCheckout, gitMerge, gitStatus, gitLog,
  gitReset, addTerminalLog, clearTerminalLogs, addWorkingFile,
} from '../../store/gitSlice';
import { markLevelSuccess, setLevel, closeModal } from '../../store/challengeSlice';
import TerminalForm from '../Terminal/TerminalForm';

// ----------- Command Parser & Dispatcher -----------
function parseAndDispatch(raw, dispatch) {
  const trimmed = raw.trim();

  if (trimmed === 'clear') {
    dispatch(clearTerminalLogs());
    return;
  }

  if (!trimmed.startsWith('git')) {
    dispatch(addTerminalLog({ type: 'error', text: 'Error: Only git commands are supported in this simulation.' }));
    return;
  }

  dispatch(addTerminalLog({ type: 'input', text: trimmed }));

  const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const sub = parts[1];
  const rest = parts.slice(2);

  switch (sub) {
    case 'init':
      dispatch(gitInit());
      break;

    case 'add': {
      const target = rest[0] ?? '.';
      dispatch(gitAdd(target));
      break;
    }

    case 'commit': {
      const mIdx = rest.indexOf('-m');
      if (mIdx === -1) {
        dispatch(addTerminalLog({ type: 'error', text: "error: switch 'm' requires a value\nUsage: git commit -m \"message\"" }));
        break;
      }
      let msg = rest[mIdx + 1] ?? '';
      msg = msg.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
      dispatch(gitCommit(msg));
      break;
    }

    case 'branch': {
      const name = rest[0];
      dispatch(gitBranch(name));
      break;
    }

    case 'checkout': {
      const isBFlag = rest[0] === '-b';
      const target = isBFlag ? rest[1] : rest[0];
      if (!target) {
        dispatch(addTerminalLog({ type: 'error', text: "error: missing branch name" }));
        break;
      }
      const payload = isBFlag ? `-b ${target}` : target;
      dispatch(gitCheckout(payload));
      break;
    }

    case 'merge': {
      const target = rest[0];
      if (!target) {
        dispatch(addTerminalLog({ type: 'error', text: 'error: No branch specified.' }));
        break;
      }
      dispatch(gitMerge(target));
      break;
    }

    case 'status':
      dispatch(gitStatus());
      break;

    case 'log':
      dispatch(gitLog());
      break;

    case 'reset': {
      const flag = rest.find(r => r.startsWith('--')) ?? '--mixed';
      const target = rest.find(r => !r.startsWith('--')) ?? 'HEAD~1';
      dispatch(gitReset({ flag, target }));
      break;
    }

    default:
      dispatch(addTerminalLog({ type: 'error', text: `git: '${sub}' is not a git command. See 'git --help'.` }));
  }
}

// ----------- DAG Visualizer (local component) -----------

/**
 * Lays out commits in topological order and assigns (x, y) canvas positions.
 * Uses column-per-branch layout for clarity.
 */
function layoutCommits(commits, branches, activeBranch) {
  if (!commits || commits.length === 0) return { nodes: [], edges: [] };

  // Topological sort (Kahn's algorithm)
  const idToCommit = {};
  commits.forEach(c => { idToCommit[c.id] = c; });

  const inDegree = {};
  commits.forEach(c => { inDegree[c.id] = 0; });
  commits.forEach(c => {
    c.parents.forEach(p => {
      if (inDegree[p] !== undefined) inDegree[p]++;
    });
  });

  const queue = commits.filter(c => inDegree[c.id] === 0).map(c => c.id);
  const sorted = [];
  const visited = new Set();
  while (queue.length) {
    const id = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    sorted.push(id);
    const c = idToCommit[id];
    if (!c) continue;
    // Push children
    commits.forEach(cc => {
      if (cc.parents.includes(id) && !visited.has(cc.id)) {
        queue.push(cc.id);
      }
    });
  }

  // Assign column (x) based on branch
  const branchColumns = {};
  let colCtr = 0;
  sorted.forEach(id => {
    const c = idToCommit[id];
    if (!c) return;
    if (branchColumns[c.branch] === undefined) {
      branchColumns[c.branch] = colCtr++;
    }
  });

  const CELL_W = 140;
  const CELL_H = 84;
  const PAD_X = 80;
  const PAD_Y = 60;

  const rowByBranch = {};
  const nodes = sorted.map((id) => {
    const c = idToCommit[id];
    if (!c) return null;
    const col = branchColumns[c.branch] ?? 0;
    rowByBranch[c.branch] = (rowByBranch[c.branch] ?? -1) + 1;
    const row = rowByBranch[c.branch];
    return {
      id: c.id,
      hash: c.hash,
      message: c.message,
      branch: c.branch,
      parents: c.parents,
      x: PAD_X + col * CELL_W,
      y: PAD_Y + row * CELL_H,
      isMerge: c.parents.length > 1,
    };
  }).filter(Boolean);

  // Build edges
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });
  const edges = [];
  nodes.forEach(n => {
    n.parents.forEach(pid => {
      const pn = nodeMap[pid];
      if (pn) {
        edges.push({ from: pn, to: n });
      }
    });
  });

  const svgW = Math.max(480, (colCtr) * CELL_W + PAD_X * 2);
  const svgH = Math.max(340, Math.max(...nodes.map(n => n.y), 0) + CELL_H + PAD_Y);

  return { nodes, edges, svgW, svgH, branchColumns };
}

const BRANCH_COLORS = [
  'var(--accent-blue)',    // #58a6ff
  'var(--accent-purple)',  // #8957e5
  'var(--accent-green)',   // #238636
  '#f0883e',               // orange
  '#f778ba',               // pink
];

function DagVisualizer() {
  const { commits, branches, activeBranch, headCommitId } = useSelector(s => s.git);
  const { nodes, edges, svgW, svgH, branchColumns } = useMemo(
    () => layoutCommits(commits, branches, activeBranch),
    [commits, branches, activeBranch]
  );

  // Assign stable color per branch
  const branchColorMap = useMemo(() => {
    const map = {};
    Object.keys(branchColumns ?? {}).forEach((b, i) => {
      map[b] = BRANCH_COLORS[i % BRANCH_COLORS.length];
    });
    return map;
  }, [branchColumns]);

  // Branch label positions
  const branchLabels = useMemo(() => {
    const labels = [];
    Object.entries(branches || {}).forEach(([name, info]) => {
      if (!info.headCommitId) return;
      const node = nodes.find(n => n.id === info.headCommitId);
      if (!node) return;
      labels.push({ name, node, isActive: name === activeBranch });
    });
    return labels;
  }, [branches, nodes, activeBranch]);

  return (
    <div className="canvas-frosted-container" style={{ minHeight: 380 }}>
      {/* Visualizer Top Bar */}
      <div
        style={{
          height: 38,
          background: 'var(--bg-surface-elevated)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13 }}>🌳</span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Git Topology Tree
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {Object.keys(branchColumns ?? {}).map(b => (
            <div
              key={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                fontFamily: "'JetBrains Mono', monospace",
                color: 'var(--text-secondary)',
                background: '#010409',
                border: '1px solid var(--border-color)',
                padding: '2px 8px',
                borderRadius: 100,
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: branchColorMap[b] ?? 'var(--accent-blue)',
                }}
              />
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* SVG Canvas Content */}
      {nodes.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 48,
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ fontSize: 36 }}>🌿</div>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>
            Repository initialized. No commits created yet.
          </p>
          <span style={{ fontSize: 11, opacity: 0.7 }}>
            Run <code>git add .</code> then <code>git commit -m "initial commit"</code> to sprout your DAG tree.
          </span>
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          <svg
            width={svgW}
            height={svgH}
            style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}
            aria-label="Git commit graph"
            role="img"
          >
            <defs>
              <filter id="dag-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const isMerge = edge.to.isMerge && edge.from.branch !== edge.to.branch;
              const color = branchColorMap[edge.from.branch] ?? 'var(--accent-blue)';
              const cx1 = edge.from.x;
              const cy1 = edge.from.y;
              const cx2 = edge.to.x;
              const cy2 = edge.to.y;
              const midY = (cy1 + cy2) / 2;
              const d = `M ${cx1} ${cy1} C ${cx1} ${midY}, ${cx2} ${midY}, ${cx2} ${cy2}`;

              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke={isMerge ? 'var(--accent-purple)' : color}
                  strokeWidth={isMerge ? 2.5 : 2}
                  strokeOpacity={0.65}
                  strokeDasharray={isMerge ? '4,4' : undefined}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map(node => {
              const color = branchColorMap[node.branch] ?? 'var(--accent-blue)';
              const isHead = node.id === headCommitId;

              return (
                <g key={node.id}>
                  {/* Glowing ring for active HEAD */}
                  {isHead && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={20}
                      fill="none"
                      stroke={color}
                      strokeWidth={2}
                      strokeOpacity={0.5}
                    >
                      <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.isMerge ? 15 : 13}
                    fill="var(--bg-surface)"
                    stroke={color}
                    strokeWidth={node.isMerge ? 3 : 2.5}
                    filter={isHead ? 'url(#dag-glow)' : undefined}
                  />

                  {/* Merge text inside node */}
                  {node.isMerge && (
                    <text
                      x={node.x}
                      y={node.y + 4}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill={color}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      M
                    </text>
                  )}

                  {/* Commit hash label */}
                  <text
                    x={node.x}
                    y={node.y + 28}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="600"
                    fill="var(--text-secondary)"
                  >
                    {node.hash.slice(0, 7)}
                  </text>

                  {/* Commit message badge */}
                  <foreignObject
                    x={node.x - 55}
                    y={node.y + 36}
                    width={110}
                    height={28}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        fontSize: 10,
                        color: 'var(--text-primary)',
                        textAlign: 'center',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        background: 'rgba(1, 4, 9, 0.75)',
                        border: '1px solid var(--border-color)',
                        borderRadius: 6,
                        padding: '2px 6px',
                        lineHeight: '18px',
                      }}
                      title={node.message}
                    >
                      {node.message}
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Branch Pointer Badges */}
            {branchLabels.map(({ name, node, isActive }) => {
              const color = branchColorMap[name] ?? 'var(--accent-blue)';
              const labelX = node.x;
              const labelY = node.y - 28;

              return (
                <g key={name}>
                  <rect
                    x={labelX - 35}
                    y={labelY - 10}
                    width={70}
                    height={18}
                    rx={9}
                    fill={isActive ? color : 'var(--bg-surface-elevated)'}
                    stroke={color}
                    strokeWidth={1.5}
                    fillOpacity={isActive ? 0.3 : 0.9}
                  />
                  <text
                    x={labelX}
                    y={labelY + 3}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="700"
                    fontFamily="'JetBrains Mono', monospace"
                    fill={isActive ? '#ffffff' : 'var(--text-primary)'}
                  >
                    {isActive ? `* ${name}` : name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

// ----------- Victory Modal (local component) -----------

function VictoryModal({ challengeId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpen = useSelector(s => s.challenge.isSuccessModalOpen);
  const challenge = getChallengeById(challengeId);
  const nextId = getNextChallengeId(challengeId);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') dispatch(closeModal());
    };
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, dispatch]);

  if (!isOpen || !challenge) return null;

  const handleNext = () => {
    dispatch(closeModal());
    if (nextId) navigate(`/challenges/${nextId}`);
    else navigate('/challenges');
  };

  const handleHome = () => {
    dispatch(closeModal());
    navigate('/challenges');
  };

  return (
    <div
      className="victory-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) dispatch(closeModal()); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-modal-title"
    >
      <div className="victory-modal-window">
        {/* Glowing Aurora Accent */}
        <div className="victory-glow" />

        {/* Confetti & Trophy */}
        <div style={{ fontSize: 44, marginBottom: 12 }}>🎉</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 22 }}>⭐</span>
          <span style={{ fontSize: 26, transform: 'translateY(-4px)' }}>⭐</span>
          <span style={{ fontSize: 22 }}>⭐</span>
        </div>

        {/* Clean High-Contrast Typography */}
        <h2
          id="victory-modal-title"
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: 8,
          }}
        >
          Quest <span style={{ color: 'var(--accent-glow)' }}>Complete!</span>
        </h2>

        {/* Challenge Pill Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(35, 134, 54, 0.1)',
            border: '1px solid rgba(35, 134, 54, 0.4)',
            color: 'var(--accent-green)',
            padding: '4px 14px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            margin: '8px auto 16px',
          }}
        >
          ✓ {challenge.emoji} Level {challenge.level}: {challenge.title}
        </div>

        {/* Summary Description */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Outstanding job! You satisfied all topology requirements and mastered this Git quest.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {nextId ? (
            <button
              className="glow-btn-purple"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px 24px',
                fontSize: 14,
                borderRadius: 10,
              }}
              onClick={handleNext}
              id="victory-next-btn"
            >
              Continue to Next Quest →
            </button>
          ) : (
            <button
              className="glow-btn-purple"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '12px 24px',
                fontSize: 14,
                borderRadius: 10,
              }}
              onClick={handleHome}
              id="victory-finish-btn"
            >
              🏆 You Beat All Quests! View Summary
            </button>
          )}

          <button
            className="glow-btn-outline"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '10px 20px',
              fontSize: 13,
              borderRadius: 10,
            }}
            onClick={handleHome}
            id="victory-home-btn"
          >
            ← Return to Challenges
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------- Main Challenge View -----------

export default function ChallengeView() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const challenge = getChallengeById(id);
  const gitState = useSelector(s => s.git);
  const isSuccessModalOpen = useSelector(s => s.challenge.isSuccessModalOpen);
  const [sideTab, setSideTab] = useState('objective');
  const [newFileName, setNewFileName] = useState('');
  const [alreadyWon, setAlreadyWon] = useState(false);

  // Load seed state when challenge id changes
  useEffect(() => {
    if (!challenge) return;
    dispatch(setLevel(id));
    dispatch(loadLevelState(challenge.seedState));
    setAlreadyWon(false);
  }, [id, dispatch]);

  // Validate after every git state change
  useEffect(() => {
    if (!challenge || alreadyWon || isSuccessModalOpen) return;
    if (challenge.validate(gitState)) {
      setAlreadyWon(true);
      dispatch(markLevelSuccess(id));
    }
  }, [gitState, challenge, alreadyWon, isSuccessModalOpen, id, dispatch]);

  if (!challenge) {
    return (
      <div style={{ paddingTop: 140, paddingBottom: 60, textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p style={{ fontSize: 20, color: '#fff', marginBottom: 16 }}>Quest not found.</p>
        <button
          onClick={() => navigate('/challenges')}
          className="glow-btn-outline"
          style={{ margin: '0 auto' }}
        >
          ← Return to Challenges
        </button>
      </div>
    );
  }

  const handleCommandRun = (cmd) => {
    parseAndDispatch(cmd, dispatch);
  };

  const handleClearLogs = () => {
    dispatch(clearTerminalLogs());
  };

  const handleAddFile = () => {
    if (!newFileName.trim()) return;
    dispatch(addWorkingFile(newFileName.trim()));
    setNewFileName('');
  };

  const handleReset = () => {
    dispatch(loadLevelState(challenge.seedState));
    setAlreadyWon(false);
  };

  return (
    <div className="playground-view-container">
      {/* ── Top Bar: Breadcrumb + Status Chips + Actions ── */}
      <div
        style={{
          width: '100%',
          maxWidth: 1100,
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <button
            onClick={() => navigate('/challenges')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-blue)',
              cursor: 'pointer',
              padding: 0,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ← Challenges
          </button>
          <span style={{ color: 'var(--text-secondary)' }}>/</span>
          <span style={{ color: '#ffffff', fontWeight: 600 }}>
            Level {challenge.level}: {challenge.title}
          </span>
        </div>

        {/* Status badges & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(88, 166, 255, 0.1)',
              border: '1px solid rgba(88, 166, 255, 0.3)',
              color: 'var(--accent-blue)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 100,
            }}
          >
            🌿 {gitState.activeBranch}
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(35, 134, 54, 0.1)',
              border: '1px solid rgba(35, 134, 54, 0.3)',
              color: 'var(--accent-green)',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              padding: '3px 10px',
              borderRadius: 100,
            }}
          >
            📦 Staged: {gitState.stagingArea.length}
          </div>

          <button
            onClick={handleReset}
            className="glow-btn-outline"
            style={{ padding: '4px 12px', fontSize: 11 }}
            id="reset-challenge-btn"
            title="Reset repository to initial level seed"
          >
            ↺ Reset Level
          </button>
        </div>
      </div>

      {/* ── Main Workspace Grid (Left: Visualizer + Terminal, Right: Side Panel) ── */}
      <div className="playground-main-grid">
        {/* Left Column: Visualizer Section */}
        <div className="visualizer-section">
          <DagVisualizer />
          <TerminalForm
            onCommandRun={handleCommandRun}
            onClear={handleClearLogs}
            onReset={handleReset}
          />
        </div>

        {/* Right Column: Side Panel */}
        <aside className="side-panel">
          {/* Header Tabs */}
          <div className="side-nav">
            <button
              className={sideTab === 'objective' ? 'active' : ''}
              onClick={() => setSideTab('objective')}
            >
              Mission
            </button>
            <button
              className={sideTab === 'steps' ? 'active' : ''}
              onClick={() => setSideTab('steps')}
            >
              Steps
            </button>
            <button
              className={sideTab === 'files' ? 'active' : ''}
              onClick={() => setSideTab('files')}
            >
              Files ({gitState.workingDirectory.length + gitState.stagingArea.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="side-content">
            {/* Tab 1: Objective & Goals */}
            {sideTab === 'objective' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{challenge.emoji}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--accent-glow)',
                        }}
                      >
                        {challenge.tier}
                      </div>
                      <h3
                        style={{
                          fontSize: 18,
                          color: '#ffffff',
                          fontWeight: 700,
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {challenge.title}
                      </h3>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
                    {challenge.objective}
                  </p>
                </div>

                {/* Victory Condition Box */}
                <div
                  style={{
                    background: 'rgba(110, 86, 207, 0.08)',
                    border: '1px solid rgba(110, 86, 207, 0.3)',
                    borderRadius: 12,
                    padding: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--accent-glow)',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      marginBottom: 6,
                    }}
                  >
                    <span>🎯</span> Victory Condition
                  </div>
                  <div style={{ color: 'var(--text-primary)', fontSize: 12.5, lineHeight: 1.5 }}>
                    {challenge.goal}
                  </div>
                </div>

                {/* Collapsible Hints */}
                <details
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                >
                  <summary
                    style={{
                      padding: '10px 14px',
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      userSelect: 'none',
                    }}
                  >
                    <span>💡 Hint & Advice</span>
                    <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>▼</span>
                  </summary>
                  <div
                    style={{
                      padding: '12px 14px',
                      fontSize: 12,
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-color)',
                      background: '#010409',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {challenge.hint}
                  </div>
                </details>
              </div>
            )}

            {/* Tab 2: Step-by-step Goals / Allowed Commands */}
            {sideTab === 'steps' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'var(--text-secondary)',
                  }}
                >
                  Quick Execution Guide
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Click any command below to autofill and execute it in your workspace terminal:
                </p>

                <div className="step-list">
                  {challenge.allowedCommands.map(cmd => (
                    <div
                      key={cmd}
                      className="step-item"
                      onClick={() => handleCommandRun(cmd)}
                      title={`Run ${cmd}`}
                    >
                      <div className="step-code">➜ {cmd}</div>
                      <div className="step-desc">Click to run immediately in simulation</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Working Directory & Staging Area */}
            {sideTab === 'files' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Add new file */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    Create Working File
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      className="terminal-input"
                      placeholder="app.js"
                      value={newFileName}
                      onChange={e => setNewFileName(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddFile()}
                      style={{
                        background: '#010409',
                        border: '1px solid var(--border-color)',
                        borderRadius: 8,
                        padding: '6px 10px',
                        fontSize: 12,
                        width: '100%',
                      }}
                    />
                    <button
                      className="glow-btn-purple"
                      onClick={handleAddFile}
                      style={{ padding: '6px 12px', fontSize: 11, flexShrink: 0 }}
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Staging Area List */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-green)',
                      marginBottom: 8,
                    }}
                  >
                    Staged Changes ({gitState.stagingArea.length})
                  </div>
                  {gitState.stagingArea.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      No files currently staged.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {gitState.stagingArea.map(f => (
                        <div
                          key={f}
                          style={{
                            background: '#010409',
                            border: '1px solid rgba(35, 134, 54, 0.3)',
                            borderRadius: 6,
                            padding: '6px 10px',
                            fontSize: 12,
                            fontFamily: "'JetBrains Mono', monospace",
                            color: 'var(--accent-green)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>A</span> {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Working Directory List */}
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#f0883e',
                      marginBottom: 8,
                    }}
                  >
                    Unstaged / Working Directory ({gitState.workingDirectory.length})
                  </div>
                  {gitState.workingDirectory.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                      Working tree clean.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {gitState.workingDirectory.map(f => (
                        <div
                          key={f}
                          style={{
                            background: '#010409',
                            border: '1px solid var(--border-color)',
                            borderRadius: 6,
                            padding: '6px 10px',
                            fontSize: 12,
                            fontFamily: "'JetBrains Mono', monospace",
                            color: '#f0883e',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <span>M</span> {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ── Victory Celebration Modal ── */}
      <VictoryModal challengeId={id} />
    </div>
  );
}
