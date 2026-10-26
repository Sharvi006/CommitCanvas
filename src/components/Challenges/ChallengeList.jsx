import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { challenges } from '../../data/challengesData';

/* ─── Status config ──────────────────────────────────────────── */
const STATUS_PILL = {
  completed: {
    color: '#27c93f',
    background: 'rgba(39, 201, 63, 0.12)',
    border: '1px solid rgba(39, 201, 63, 0.3)',
    label: '✓ Completed',
  },
  available: {
    color: '#58a6ff',
    background: 'rgba(88, 166, 255, 0.12)',
    border: '1px solid rgba(88, 166, 255, 0.3)',
    label: '▶ Available',
  },
  locked: {
    color: '#6e7681',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    label: '🔒 Locked',
  },
};

const TIER_COLOR = {
  'Tier 1: Linear Basics':      '#58a6ff',
  'Tier 2: Parallel History':   '#a78bfa',
  'Tier 3: Merging & Topology': '#27c93f',
};

/* ─── Card subcomponent (tracks hover locally) ───────────────── */
function ChallengeCard({ challenge, idx, status, navigate }) {
  const [hovered, setHovered] = React.useState(false);
  const isClickable = status !== 'locked';
  const pill = STATUS_PILL[status];
  const tierColor = TIER_COLOR[challenge.tier] ?? '#58a6ff';

  /* Base card style */
  const cardStyle = {
    background: 'rgba(22, 27, 34, 0.75)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${hovered && isClickable ? 'rgba(88,166,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 18,
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 20,
    boxShadow: hovered && isClickable
      ? '0 20px 40px rgba(0,0,0,0.5), 0 0 18px rgba(88,166,255,0.12)'
      : '0 12px 30px rgba(0, 0, 0, 0.4)',
    transition: 'transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
    transform: hovered && isClickable ? 'translateY(-3px)' : 'none',
    cursor: isClickable ? 'pointer' : 'default',
    opacity: status === 'locked' ? 0.55 : 1,
    position: 'relative',
    overflow: 'hidden',
  };

  /* CTA button */
  const ctaStyle = (disabled) => ({
    background: disabled
      ? 'rgba(110,86,207,0.2)'
      : 'linear-gradient(135deg, #6e56cf 0%, #58a6ff 100%)',
    color: '#fff',
    padding: '8px 20px',
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 13,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    boxShadow: disabled ? 'none' : '0 0 14px rgba(88,166,255,0.35)',
    transition: 'opacity 0.2s',
  });

  return (
    <article
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => isClickable && navigate(`/challenges/${challenge.id}`)}
      onKeyDown={e => e.key === 'Enter' && isClickable && navigate(`/challenges/${challenge.id}`)}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-label={`Challenge ${challenge.level}: ${challenge.title} — ${status}`}
      id={`challenge-card-${challenge.id}`}
    >
      {/* ── Top row: Tier label + emoji + status pill ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p style={{
          fontSize: 11,
          fontWeight: 600,
          color: tierColor,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          margin: 0,
          lineHeight: 1.4,
        }}>
          TIER {idx + 1}: {challenge.tier.replace(/^Tier \d+:\s*/i, '').toUpperCase()}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 100,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
            fontFamily: "'JetBrains Mono', monospace",
            color: pill.color,
            background: pill.background,
            border: pill.border,
            whiteSpace: 'nowrap',
          }}>
            {pill.label}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          {challenge.title}
        </h3>
        <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.55, margin: '0 0 14px' }}>
          {challenge.objective}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {challenge.allowedCommands.map(cmd => (
            <code
              key={cmd}
              style={{
                background: '#0d1117',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#c9d1d9',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                padding: '4px 8px',
                borderRadius: 6,
              }}
            >
              {cmd}
            </code>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 11,
          color: '#8b949e',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '3px 10px',
          borderRadius: 100,
        }}>
          Level {challenge.level}
        </span>

        {status === 'available' && (
          <button
            style={ctaStyle(false)}
            id={`start-btn-${challenge.id}`}
            onClick={e => { e.stopPropagation(); navigate(`/challenges/${challenge.id}`); }}
          >
            Start →
          </button>
        )}
        {status === 'completed' && (
          <button
            style={{ ...ctaStyle(false), background: 'linear-gradient(135deg, #1a7f37 0%, #27c93f 100%)', boxShadow: '0 0 14px rgba(39,201,63,0.35)' }}
            id={`replay-btn-${challenge.id}`}
            onClick={e => { e.stopPropagation(); navigate(`/challenges/${challenge.id}`); }}
          >
            ↺ Replay
          </button>
        )}
        {status === 'locked' && (
          <button style={ctaStyle(true)} disabled aria-disabled="true">
            🔒 Locked
          </button>
        )}
      </div>


    </article>
  );
}

/* ─── Main export ─────────────────────────────────────────────── */
export default function ChallengeList() {
  const completedLevels = useSelector(s => s.challenge.completedLevels);
  const navigate = useNavigate();

  const completedCount = challenges.filter(c => completedLevels.includes(c.id)).length;
  const pct = Math.round((completedCount / challenges.length) * 100);

  const getStatus = (challenge, idx) => {
    if (completedLevels.includes(challenge.id)) return 'completed';
    if (idx === 0 || completedLevels.includes(challenges[idx - 1].id)) return 'available';
    return 'locked';
  };

  return (
    <div style={{ animation: 'playgroundPop 0.45s cubic-bezier(0.175,0.885,0.32,1.275) forwards' }}>

      {/* ══ HERO HEADER ══ */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '130px 24px 48px',
      }}>
        {/* Category badge */}
        <div className="badge">
          <span className="pulse-dot" style={{ background: '#a78bfa', boxShadow: '0 0 12px #a78bfa' }} />
          QUEST SYSTEM
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: 52,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.03em',
          margin: '12px 0',
          lineHeight: 1.1,
        }}>
          Git Challenges
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 16,
          color: '#8b949e',
          maxWidth: 580,
          margin: '0 auto 28px',
          lineHeight: 1.6,
        }}>
          Master Git through hands-on, story-driven quests.&nbsp;Each challenge unlocks the next.
        </p>

        {/* Progress block */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#8b949e', marginBottom: 8 }}>
            Overall Progress:&nbsp;
            <span style={{ color: '#58a6ff', fontWeight: 600 }}>
              {completedCount}/{challenges.length} Completed
            </span>
          </p>
          <div style={{
            width: 320,
            height: 6,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 10,
            overflow: 'hidden',
            margin: '0 auto',
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #58a6ff 0%, #8957e5 100%)',
              borderRadius: 10,
              transition: 'width 0.7s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: '0 0 10px rgba(88,166,255,0.5)',
            }} />
          </div>
        </div>
      </div>

      {/* ══ CHALLENGES GRID ══ */}
      <div className="challenge-list-grid" style={{
        maxWidth: 1000,
        margin: '0 auto 80px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 24,
      }}>
        {challenges.map((challenge, idx) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            idx={idx}
            status={getStatus(challenge, idx)}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
}
