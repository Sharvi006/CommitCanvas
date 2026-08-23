import React, { useState, useEffect } from "react";
import "./Play.css";
import { initialLogs, processGitCommand } from "../../utils/gitLogic";

export default function Play({ commandToExecute }) {
  // Global & Interactive States
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasStaged, setHasStaged] = useState(false);
  const [commits, setCommits] = useState([]);
  const [logs, setLogs] = useState(initialLogs);

  // Helper handler
  const handleCommand = (cmd) => {
    processGitCommand(
      cmd,
      { isInitialized, hasStaged, commits, logs },
      { setIsInitialized, setHasStaged, setCommits, setLogs }
    );
  };

  // Process incoming command from parent component
  useEffect(() => {
    if (commandToExecute) {
      handleCommand(commandToExecute);
    }
  }, [commandToExecute]);

  return (
    <div className="play-container">
      {/* 1. VISUALIZER TREE */}
      <div className="playground-full">
        <div className="playground-title">
          <h2>Git Commit Nodes Visualizer</h2>
        </div>

        <div className="tree-container">
          {!isInitialized ? (
            <div className="message">
              Type <b className="highlight-cmd">git init</b> in the input bar to initialize repository visualizer
            </div>
          ) : commits.length === 0 ? (
            <div className="message">
              Run <b className="highlight-cmd">git add .</b> then <b className="highlight-cmd">git commit -m "msg"</b> to spawn nodes!
            </div>
          ) : (
            <div className="dots-row">
              {commits.map((commit, index) => (
                <div key={commit.id} className="dot-wrapper">
                  <div className={`neon-dot ${commit.pushed ? "pushed" : ""}`}>
                    <div className="inner-light"></div>
                  </div>

                  <div className="dot-text">
                    <span className="hash">#{commit.id}</span>
                    <span className="msg" title={commit.msg}>{commit.msg}</span>
                  </div>

                  {index < commits.length - 1 && (
                    <div className={`glow-line ${commit.pushed ? "pushed" : ""}`}></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. TERMINAL SECTION */}
      <div className="bottom-layout">
        <div className="terminal-card">
          <div className="terminal-header">
            <div className="window-buttons">
              <span className="btn red"></span>
              <span className="btn yellow"></span>
              <span className="btn green"></span>
            </div>
            <span className="title">bash — git output terminal</span>
          </div>

          <div className="terminal-logs">
            {logs.map((log, index) => (
              <div key={index} className="log-line">
                {log.startsWith("$") ? <span className="cmd-prompt">{log}</span> : log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
