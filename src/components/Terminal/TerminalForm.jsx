import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function TerminalForm({ onCommandRun, onClear, onReset }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const terminalLogs = useSelector((s) => s.git.terminalLogs || []);
  const logEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setHistory((prev) => [cmd, ...prev]);
    setHistIdx(-1);
    setInput('');
    onCommandRun(cmd);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHistIdx((prev) => {
        const next = Math.min(prev + 1, history.length - 1);
        setInput(history[next] ?? '');
        return next;
      });
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHistIdx((prev) => {
        const next = Math.max(prev - 1, -1);
        setInput(next === -1 ? '' : history[next] ?? '');
        return next;
      });
    } else if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleResetClick = () => {
    setInput('');
    if (onReset) {
      onReset();
    } else if (onClear) {
      onClear();
    }
  };

  return (
    <>
      {/* =========================================
          1. TERMINAL OUTPUT BOX (matches Playground)
      ========================================= */}
      <div className="bottom-layout">
        <div className="terminal-card">
          {/* TERMINAL HEADER */}
          <div className="terminal-header">
            <div className="window-buttons">
              <span className="btn red"></span>
              <span className="btn yellow"></span>
              <span className="btn green"></span>
            </div>
            <span className="title">bash — git output terminal</span>
          </div>

          {/* TERMINAL LOGS */}
          <div className="terminal-logs" id="terminal-log-body">
            {terminalLogs.length === 0 ? (
              <div className="log-line">
                Welcome! Type commands in the CLI input bar: git init, git add ., git commit -m "msg", git push
              </div>
            ) : (
              terminalLogs.map((log, index) => (
                <div key={index} className="log-line">
                  {log.type === 'input' || (typeof log === 'string' && log.startsWith('$')) ? (
                    <span className="cmd-prompt">
                      {typeof log === 'string'
                        ? log
                        : log.text.startsWith('$')
                        ? log.text
                        : `$ ${log.text}`}
                    </span>
                  ) : log.type === 'error' ? (
                    <span style={{ color: '#ff7b72' }}>
                      {typeof log === 'string' ? log : log.text}
                    </span>
                  ) : (
                    <span>{typeof log === 'string' ? log : log.text}</span>
                  )}
                </div>
              ))
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>

      {/* =========================================
          2. INTERACTIVE GIT TERMINAL INPUT BAR
      ========================================= */}
      <div
        className="command-terminal-wrapper"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="terminal-header">
          <div className="dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <div className="terminal-title">Interactive Git Terminal</div>
        </div>

        <div className="terminal-inner">
          <form onSubmit={handleSubmit} className="command-form">
            <div className="terminal-input-row">
              <span className="prompt-symbol">➜</span>
              <input
                ref={inputRef}
                type="text"
                className="terminal-input"
                placeholder="Type git command... (e.g. git commit -m 'feat: initial')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
                aria-label="Git command input"
              />
            </div>

            <div className="command-actions">
              <button
                type="button"
                className="glow-btn-outline"
                onClick={handleResetClick}
                id="terminal-reset-btn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path>
                </svg>
                Reset
              </button>

              <button
                type="submit"
                className="glow-btn-purple"
                id="terminal-run-btn"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Run
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
