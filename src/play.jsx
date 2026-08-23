// import React, { useState, useEffect } from "react";

// export default function Play({ commandToExecute }) {
//   // Simple State Management
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [hasStaged, setHasStaged] = useState(false);
//   const [commits, setCommits] = useState([]);
//   const [logs, setLogs] = useState([
//     "Welcome! Run commands using the CLI terminal below: git init, git add ., git commit -m \"msg\", git push"
//   ]);
//   const [lastExecutedCmd, setLastExecutedCmd] = useState("");
//   const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'learn' | 'command' | 'about'

//   // Helper function to process git commands
//   const processCommand = (cmdText) => {
//     const cmd = cmdText.trim();
//     if (!cmd) return;

//     setLastExecutedCmd(cmd);
//     let newLogs = [...logs, `$ ${cmd}`];

//     if (cmd === "git init") {
//       setIsInitialized(true);
//       newLogs.push("Initialized empty Git repository in .git/");
//     } 
//     else if (cmd === "git add .") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else {
//         setHasStaged(true);
//         newLogs.push("Changes staged for commit.");
//       }
//     } 
//     else if (cmd.startsWith("git commit")) {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (!hasStaged) {
//         newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
//       } else {
//         const msg = cmd.split('-m')[1] ? cmd.split('-m')[1].replace(/["']/g, "").trim() : "New Commit";
//         const newCommit = {
//           id: Math.random().toString(36).substring(2, 7),
//           msg: msg,
//           pushed: false
//         };
//         setCommits((prevCommits) => [...prevCommits, newCommit]);
//         setHasStaged(false);
//         newLogs.push(`[main ${newCommit.id}] ${msg}`);
//       }
//     } 
//     else if (cmd === "git push") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (commits.length === 0) {
//         newLogs.push("Everything up-to-date");
//       } else {
//         setCommits((prevCommits) => prevCommits.map(c => ({ ...c, pushed: true })));
//         newLogs.push("Successfully pushed to main branch!");
//       }
//     } 
//     else {
//       newLogs.push(`Command not recognized: '${cmd}'`);
//     }

//     setLogs(newLogs);
//   };

//   // Listen for commands passed from App.jsx CLI input
//   useEffect(() => {
//     if (commandToExecute) {
//       processCommand(commandToExecute);
//     }
//   }, [commandToExecute]);

//   // Command explanation for Learn Section
//   const getCommandExplanation = (cmd) => {
//     if (!cmd) return "Run any Git command using the input terminal to see its real-time explanation here!";
//     if (cmd === "git init") {
//       return "Creates a new empty Git repository. It initializes the hidden '.git' directory where Git stores all tracking metadata and version history.";
//     }
//     if (cmd === "git add .") {
//       return "Stages all current changes in your working directory. This prepares your files to be included in the next snapshot (commit).";
//     }
//     if (cmd.startsWith("git commit")) {
//       return "Saves a permanent snapshot of your staged changes into the local repository graph along with a descriptive message.";
//     }
//     if (cmd === "git push") {
//       return "Uploads your local commits to the remote repository (e.g., GitHub), synchronizing your local progress with the cloud.";
//     }
//     return `Executed command: '${cmd}'. This command updates the local workspace tree or outputs status details.`;
//   };

//   return (
//     <div className="full-screen-container">
      
//       {/* 1. PLAYGROUND (Top Visualizer Section) */}
//       <div className="playground-full">
//         <div className="playground-title">
//           <span className="badge">LIVE TREE PLAYGROUND</span>
//           <h2>Git Commit Nodes Visualizer</h2>
//         </div>

//         <div className="tree-container">
//           {!isInitialized ? (
//             <div className="message">Type <b>git init</b> in terminal below to start tree visualizer</div>
//           ) : commits.length === 0 ? (
//             <div className="message">Run <b>git add .</b> then <b>git commit -m "msg"</b> to spawn dots!</div>
//           ) : (
//             <div className="dots-row">
//               {commits.map((commit, index) => (
//                 <div key={commit.id} className="dot-wrapper">
//                   <div className={`neon-dot ${commit.pushed ? "pushed" : ""}`}>
//                     <div className="inner-light"></div>
//                   </div>
                  
//                   <div className="dot-text">
//                     <span className="hash">#{commit.id}</span>
//                     <span className="msg">{commit.msg}</span>
//                   </div>

//                   {index < commits.length - 1 && <div className="glow-line"></div>}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. BOTTOM LAYOUT (Terminal Left + Interactive Tabbed Sidebar Right) */}
//       <div className="bottom-layout">
        
//         {/* Terminal Card (Only Displays Output Logs) */}
//         <div className="terminal-card">
//           <div className="terminal-header">
//             <div className="window-buttons">
//               <span className="btn red"></span>
//               <span className="btn yellow"></span>
//               <span className="btn green"></span>
//             </div>
//             <span className="title">bash — git output terminal</span>
//           </div>

//           <div className="terminal-logs">
//             {logs.map((log, index) => (
//               <div key={index} className="log-line">{log}</div>
//             ))}
//           </div>
//         </div>

//         {/* Right Section: Tabbed Sidebar */}
//         <div className="state-sidebar">
          
//           {/* Custom Sidebar Navigation Bar */}
//           <div className="sidebar-nav">
//             <button 
//               className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
//               onClick={() => setActiveTab('dashboard')}
//             >
//               Dashboard
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
//               onClick={() => setActiveTab('learn')}
//             >
//               Learn
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'command' ? 'active' : ''}`}
//               onClick={() => setActiveTab('command')}
//             >
//               Command
//             </button>
//             <button 
//               className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`}
//               onClick={() => setActiveTab('about')}
//             >
//               About
//             </button>
//           </div>

//           {/* TAB 1: DASHBOARD (State & Flow) */}
//           {activeTab === 'dashboard' && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>State & Flow</h3>
//                 <span className="status-indicator">LIVE</span>
//               </div>

//               <div className="flow-step">
//                 <span className="step-label">Repository Status</span>
//                 <div className={`step-value ${isInitialized ? "active" : ""}`}>
//                   {isInitialized ? "Initialized (.git)" : "Not Initialized"}
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Staging Area</span>
//                 <div className={`step-value ${hasStaged ? "active" : ""}`}>
//                   {hasStaged ? "Changes Staged" : "Clean Working Tree"}
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Commits Tracked</span>
//                 <div className="step-value active">
//                   {commits.length} Commit{commits.length !== 1 ? "s" : ""} Created
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Remote Push Status</span>
//                 <div className={`step-value ${commits.some(c => c.pushed) ? "pushed" : ""}`}>
//                   {commits.length === 0 
//                     ? "No Commits" 
//                     : commits.every(c => c.pushed) 
//                     ? "Synced with Remote" 
//                     : "Unpushed Commits Exist"}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 2: LEARN */}
//           {activeTab === 'learn' && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>Command Explanation</h3>
//                 <span className="status-indicator info">LEARN</span>
//               </div>
//               <div className="info-box">
//                 <span className="info-cmd">{lastExecutedCmd ? `$ ${lastExecutedCmd}` : "No Command Run Yet"}</span>
//                 <p className="info-desc">{getCommandExplanation(lastExecutedCmd)}</p>
//               </div>
//             </div>
//           )}

//           {/* TAB 3: COMMAND (Step-by-Step Workflow Guide) */}
//           {activeTab === 'command' && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>Step-by-Step Commands</h3>
//                 <span className="status-indicator">GUIDE</span>
//               </div>
//               <div className="guide-list">
//                 <div className="guide-item">
//                   <span className="num">1</span>
//                   <div>
//                     <code>git init</code>
//                     <p>Initialize empty local repo</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">2</span>
//                   <div>
//                     <code>git add .</code>
//                     <p>Stage working tree files</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">3</span>
//                   <div>
//                     <code>git commit -m "msg"</code>
//                     <p>Create visual node snapshot</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">4</span>
//                   <div>
//                     <code>git push</code>
//                     <p>Sync commits to remote branch</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 4: ABOUT */}
//           {activeTab === 'about' && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>About Visualizer</h3>
//               </div>
//               <div className="about-box">
//                 <p><b>Commit Canvas</b> is an interactive workspace that transforms terminal Git commands into visual glowing node structures.</p>
//                 <p style={{ marginTop: '10px' }}>Designed to give developers clear insight into staging, commit DAG tracking, and cloud push synchronization.</p>
//               </div>
//             </div>
//           )}

//         </div>

//       </div>

//       {/* Embedded Responsive CSS Styling */}
//       <style>{`
//         .full-screen-container {
//           width: 100%;
//           max-width: 1000px;
//           box-sizing: border-box;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           font-family: 'Inter', -apple-system, sans-serif;
//         }

//         .playground-full {
//           width: 100%;
//           min-height: 220px;
//           background: rgba(22, 27, 34, 0.7);
//           backdrop-filter: blur(16px);
//           border: 1px solid rgba(110, 86, 207, 0.35);
//           border-radius: 16px;
//           padding: 20px 30px;
//           box-sizing: border-box;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
//           display: flex;
//           flex-direction: column;
//         }

//         .playground-title {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .playground-title h2 {
//           color: #ffffff;
//           margin: 0;
//           font-size: 1.3rem;
//         }

//         .badge {
//           background: rgba(110, 86, 207, 0.2);
//           border: 1px solid #8957e5;
//           color: #c084fc;
//           padding: 3px 10px;
//           border-radius: 12px;
//           font-size: 0.75rem;
//           font-weight: bold;
//         }

//         .tree-container {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           overflow-x: auto;
//           padding: 20px 0;
//         }

//         .message {
//           color: #a5b4fc;
//           width: 100%;
//           text-align: center;
//           font-size: 0.95rem;
//         }

//         .dots-row {
//           display: flex;
//           align-items: flex-start;
//           padding: 10px 20px;
//         }

//         .dot-wrapper {
//           display: flex;
//           align-items: center;
//           position: relative;
//         }

//         .neon-dot {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: #58a6ff;
//           box-shadow: 0 0 15px #58a6ff, 0 0 30px #58a6ff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           z-index: 2;
//         }

//         .neon-dot.pushed {
//           background: #238636;
//           box-shadow: 0 0 15px #27c93f, 0 0 30px #27c93f;
//         }

//         .inner-light {
//           width: 8px;
//           height: 8px;
//           background: #ffffff;
//           border-radius: 50%;
//         }

//         .glow-line {
//           width: 70px;
//           height: 3px;
//           background: #58a6ff;
//           box-shadow: 0 0 10px #58a6ff;
//           z-index: 1;
//         }

//         .dot-text {
//           position: absolute;
//           top: 38px;
//           left: -20px;
//           width: 68px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//         }

//         .dot-text .hash {
//           color: #58a6ff;
//           font-size: 0.75rem;
//           font-family: monospace;
//         }

//         .dot-text .msg {
//           color: #ffffff;
//           font-size: 0.8rem;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           max-width: 75px;
//         }

//         /* Bottom Split Layout */
//         .bottom-layout {
//           display: flex;
//           gap: 20px;
//           min-height: 290px;
//         }

//         /* Terminal Left */
//         .terminal-card {
//           flex: 6;
//           background: #010409;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 16px;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 0 10px 30px rgba(0,0,0,0.7);
//           overflow: hidden;
//         }

//         .terminal-header {
//           background: #161b22;
//           padding: 12px 20px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .window-buttons {
//           display: flex;
//           gap: 8px;
//         }

//         .btn {
//           width: 12px;
//           height: 12px;
//           border-radius: 50%;
//         }
//         .btn.red { background: #ff5f56; }
//         .btn.yellow { background: #ffbd2e; }
//         .btn.green { background: #27c93f; }

//         .terminal-header .title {
//           color: #8b949e;
//           font-family: monospace;
//           font-size: 0.85rem;
//           margin-left: 15px;
//         }

//         .terminal-logs {
//           flex: 1;
//           padding: 20px;
//           max-height: 230px;
//           overflow-y: auto;
//           font-family: 'JetBrains Mono', monospace, sans-serif;
//           color: #58a6ff;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           font-size: 0.9rem;
//         }

//         /* Sidebar Right with Navigation Bar */
//         .state-sidebar {
//           flex: 4;
//           background: rgba(22, 27, 34, 0.85);
//           border: 1px solid rgba(110, 86, 207, 0.3);
//           border-radius: 16px;
//           padding: 16px;
//           display: flex;
//           flex-direction: column;
//           backdrop-filter: blur(12px);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
//         }

//         /* Attractive Navbar inside Sidebar */
//         .sidebar-nav {
//           display: flex;
//           background: #0d1117;
//           padding: 4px;
//           border-radius: 10px;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           margin-bottom: 16px;
//           gap: 4px;
//         }

//         .nav-btn {
//           flex: 1;
//           background: transparent;
//           border: none;
//           color: #8b949e;
//           font-size: 0.75rem;
//           font-weight: 600;
//           padding: 8px 0;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.25s ease;
//         }

//         .nav-btn:hover {
//           color: #ffffff;
//           background: rgba(110, 86, 207, 0.2);
//         }

//         .nav-btn.active {
//           color: #ffffff;
//           background: linear-gradient(135deg, #6e56cf 0%, #58a6ff 100%);
//           box-shadow: 0 0 10px rgba(110, 86, 207, 0.4);
//         }

//         .tab-content {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//           flex: 1;
//         }

//         .fade-in {
//           animation: fadeIn 0.3s ease-in-out;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(4px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .sidebar-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 6px;
//         }

//         .sidebar-header h3 {
//           color: #f0f6fc;
//           margin: 0;
//           font-size: 0.95rem;
//         }

//         .status-indicator {
//           font-size: 0.65rem;
//           color: #34d399;
//           background: rgba(52, 211, 153, 0.1);
//           padding: 2px 8px;
//           border-radius: 10px;
//           border: 1px solid rgba(52, 211, 153, 0.3);
//           font-weight: 600;
//         }

//         .status-indicator.info {
//           color: #58a6ff;
//           background: rgba(88, 166, 255, 0.1);
//           border-color: rgba(88, 166, 255, 0.3);
//         }

//         /* Flow Dashboard Styles */
//         .flow-step {
//           background: #0d1117;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 8px;
//           padding: 8px 12px;
//           display: flex;
//           flex-direction: column;
//           gap: 2px;
//         }

//         .step-label {
//           color: #8b949e;
//           font-size: 0.7rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .step-value {
//           color: #8b949e;
//           font-size: 0.8rem;
//           font-weight: 600;
//         }

//         .step-value.active { color: #58a6ff; }
//         .step-value.pushed { color: #34d399; }

//         .flow-arrow {
//           text-align: center;
//           color: #6e56cf;
//           font-size: 0.8rem;
//           line-height: 1;
//         }

//         /* Learn Box Styles */
//         .info-box {
//           background: #0d1117;
//           border: 1px solid rgba(110, 86, 207, 0.3);
//           border-radius: 10px;
//           padding: 14px;
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .info-cmd {
//           color: #38bdf8;
//           font-family: monospace;
//           font-size: 0.85rem;
//           font-weight: bold;
//         }

//         .info-desc {
//           color: #c9d1d9;
//           font-size: 0.8rem;
//           line-height: 1.4;
//         }

//         /* Command Step List Styles */
//         .guide-list {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .guide-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           background: #0d1117;
//           padding: 8px 12px;
//           border-radius: 8px;
//           border: 1px solid rgba(255, 255, 255, 0.05);
//         }

//         .guide-item .num {
//           background: rgba(110, 86, 207, 0.3);
//           color: #c084fc;
//           width: 22px;
//           height: 22px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 0.75rem;
//           font-weight: bold;
//         }

//         .guide-item code {
//           color: #58a6ff;
//           font-size: 0.8rem;
//           font-weight: bold;
//         }

//         .guide-item p {
//           color: #8b949e;
//           font-size: 0.7rem;
//           margin: 0;
//         }

//         /* About Box Styles */
//         .about-box {
//           background: #0d1117;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 10px;
//           padding: 14px;
//           color: #c9d1d9;
//           font-size: 0.8rem;
//           line-height: 1.5;
//         }

//         @media (max-width: 768px) {
//           .bottom-layout {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }

// import React, { useState, useEffect } from "react";

// export default function Play({ commandToExecute }) {
//   // States
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [hasStaged, setHasStaged] = useState(false);
//   const [commits, setCommits] = useState([]);
//   const [logs, setLogs] = useState([
//     "Welcome! Type commands in the CLI input bar: git init, git add ., git commit -m \"msg\", git push"
//   ]);
//   const [lastExecutedCmd, setLastExecutedCmd] = useState("");
//   const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'learn' | 'command' | 'about'

//   // Command Processing Logic
//   const processCommand = (cmdText) => {
//     const cmd = cmdText.trim();
//     if (!cmd) return;

//     setLastExecutedCmd(cmd);
//     let newLogs = [...logs, `$ ${cmd}`];

//     if (cmd === "git init") {
//       setIsInitialized(true);
//       newLogs.push("Initialized empty Git repository in .git/");
//     } 
//     else if (cmd === "git add .") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository (or any of the parent directories): .git");
//       } else {
//         setHasStaged(true);
//         newLogs.push("Changes staged for commit.");
//       }
//     } 
//     else if (cmd.startsWith("git commit")) {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (!hasStaged) {
//         newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
//       } else {
//         const msgMatch = cmd.split("-m")[1];
//         const msg = msgMatch ? msgMatch.replace(/["']/g, "").trim() : "New Commit";
//         const newCommit = {
//           id: Math.random().toString(36).substring(2, 7),
//           msg: msg || "Commit node",
//           pushed: false
//         };
//         setCommits((prev) => [...prev, newCommit]);
//         setHasStaged(false);
//         newLogs.push(`[main ${newCommit.id}] ${msg}`);
//       }
//     } 
//     else if (cmd === "git push") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (commits.length === 0) {
//         newLogs.push("Everything up-to-date");
//       } else {
//         setCommits((prev) => prev.map((c) => ({ ...c, pushed: true })));
//         newLogs.push("Successfully pushed local commits to origin/main!");
//       }
//     } 
//     else {
//       newLogs.push(`Command not recognized: '${cmd}'`);
//     }

//     setLogs(newLogs);
//   };

//   // Process incoming command from App.jsx parent component
//   useEffect(() => {
//     if (commandToExecute) {
//       processCommand(commandToExecute);
//     }
//   }, [commandToExecute]);

//   // Dynamic Command Helper for Learn Tab
//   const getCommandExplanation = (cmd) => {
//     if (!cmd) return "Run any Git command in the input bar above to see its real-time explanation here!";
//     if (cmd === "git init") {
//       return "git init: Initializes a new hidden '.git' directory in your project folder, turning it into a tracked Git repository.";
//     }
//     if (cmd === "git add .") {
//       return "git add .: Moves modified and untracked files from Working Directory to the Staging Area, preparing them for snapshotting.";
//     }
//     if (cmd.startsWith("git commit")) {
//       return "git commit -m 'msg': Captures a permanent snapshot node of all staged files in the local repository chain with a commit message.";
//     }
//     if (cmd === "git push") {
//       return "git push: Uploads local branch commits to the remote repository (e.g. GitHub), updating remote refs.";
//     }
//     return `Executed '${cmd}'. This command inspects or alters your current workspace state graph.`;
//   };

//   return (
//     <div className="play-container">
//       {/* 1. VISUALIZER TREE (TOP SECTION) */}
//       <div className="playground-full">
//         <div className="playground-title">
//           <span className="badge">LIVE TREE PLAYGROUND</span>
//           <h2>Git Commit Nodes Visualizer</h2>
//         </div>

//         <div className="tree-container">
//           {!isInitialized ? (
//             <div className="message">
//               Type <b className="highlight-cmd">git init</b> in the input bar to initialize repository visualizer
//             </div>
//           ) : commits.length === 0 ? (
//             <div className="message">
//               Run <b className="highlight-cmd">git add .</b> then <b className="highlight-cmd">git commit -m "msg"</b> to spawn nodes!
//             </div>
//           ) : (
//             <div className="dots-row">
//               {commits.map((commit, index) => (
//                 <div key={commit.id} className="dot-wrapper">
//                   <div className={`neon-dot ${commit.pushed ? "pushed" : ""}`}>
//                     <div className="inner-light"></div>
//                   </div>

//                   <div className="dot-text">
//                     <span className="hash">#{commit.id}</span>
//                     <span className="msg" title={commit.msg}>{commit.msg}</span>
//                   </div>

//                   {index < commits.length - 1 && <div className={`glow-line ${commit.pushed ? "pushed" : ""}`}></div>}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. BOTTOM SECTION (TERMINAL LOGS + SIDEBAR) */}
//       <div className="bottom-layout">
//         {/* Terminal Logs Output Card */}
//         <div className="terminal-card">
//           <div className="terminal-header">
//             <div className="window-buttons">
//               <span className="btn red"></span>
//               <span className="btn yellow"></span>
//               <span className="btn green"></span>
//             </div>
//             <span className="title">bash — git output terminal</span>
//           </div>

//           <div className="terminal-logs">
//             {logs.map((log, index) => (
//               <div key={index} className="log-line">
//                 {log.startsWith("$") ? <span className="cmd-prompt">{log}</span> : log}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tabbed State Sidebar */}
//         <div className="state-sidebar">
//           {/* Sidebar Nav Header */}
//           <div className="sidebar-nav">
//             <button
//               className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
//               onClick={() => setActiveTab("dashboard")}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "learn" ? "active" : ""}`}
//               onClick={() => setActiveTab("learn")}
//             >
//               Learn
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "command" ? "active" : ""}`}
//               onClick={() => setActiveTab("command")}
//             >
//               Command
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "about" ? "active" : ""}`}
//               onClick={() => setActiveTab("about")}
//             >
//               About
//             </button>
//           </div>

//           {/* TAB 1: DASHBOARD */}
//           {activeTab === "dashboard" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>State & Flow</h3>
//                 <span className="status-indicator">ACTIVE</span>
//               </div>

//               <div className="flow-step">
//                 <span className="step-label">Repository Status</span>
//                 <div className={`step-value ${isInitialized ? "active" : ""}`}>
//                   {isInitialized ? "Initialized (.git)" : "Not Initialized"}
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Staging Area</span>
//                 <div className={`step-value ${hasStaged ? "active" : ""}`}>
//                   {hasStaged ? "Changes Staged" : "Clean Working Tree"}
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Commits Tracked</span>
//                 <div className="step-value active">
//                   {commits.length} Commit{commits.length !== 1 ? "s" : ""} Created
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Remote Push Status</span>
//                 <div className={`step-value ${commits.some((c) => c.pushed) ? "pushed" : ""}`}>
//                   {commits.length === 0
//                     ? "No Commits"
//                     : commits.every((c) => c.pushed)
//                     ? "Synced with Remote"
//                     : "Unpushed Commits Exist"}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 2: LEARN */}
//           {activeTab === "learn" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>Command Explanation</h3>
//                 <span className="status-indicator info">LEARN</span>
//               </div>
//               <div className="info-box">
//                 <span className="info-cmd">
//                   {lastExecutedCmd ? `$ ${lastExecutedCmd}` : "No Command Run Yet"}
//                 </span>
//                 <p className="info-desc">{getCommandExplanation(lastExecutedCmd)}</p>
//               </div>
//             </div>
//           )}

//           {/* TAB 3: COMMAND (GUIDE) */}
//           {activeTab === "command" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>Step-by-Step Commands</h3>
//                 <span className="status-indicator">GUIDE</span>
//               </div>
//               <div className="guide-list">
//                 <div className="guide-item">
//                   <span className="num">1</span>
//                   <div>
//                     <code>git init</code>
//                     <p>Initialize empty local repository</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">2</span>
//                   <div>
//                     <code>git add .</code>
//                     <p>Stage working directory files</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">3</span>
//                   <div>
//                     <code>git commit -m "msg"</code>
//                     <p>Create visual node snapshot</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">4</span>
//                   <div>
//                     <code>git push</code>
//                     <p>Sync commits to remote branch</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 4: ABOUT */}
//           {activeTab === "about" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>About Visualizer</h3>
//               </div>
//               <div className="about-box">
//                 <p>
//                   <b>Commit Canvas</b> is an interactive playground that converts terminal commands into live glowing DAG commit nodes.
//                 </p>
//                 <p style={{ marginTop: "8px" }}>
//                   Designed to help developers master staging flow, node commit tracking, and branch pushing visually.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Embedded CSS matching App.jsx design tokens */}
//       <style>{`
//         .play-container {
//           width: 100%;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           box-sizing: border-box;
//         }

//         .playground-full {
//           width: 100%;
//           min-height: 220px;
//           background: rgba(22, 27, 34, 0.75);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid rgba(110, 86, 207, 0.35);
//           border-radius: 16px;
//           padding: 20px 24px;
//           box-sizing: border-box;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
//           display: flex;
//           flex-direction: column;
//         }

//         .playground-title {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .playground-title h2 {
//           color: #ffffff;
//           margin: 0;
//           font-size: 1.2rem;
//           font-weight: 600;
//           letter-spacing: -0.02em;
//         }

//         .badge {
//           background: rgba(110, 86, 207, 0.2);
//           border: 1px solid #8957e5;
//           color: #c084fc;
//           padding: 3px 10px;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           font-weight: 700;
//           letter-spacing: 0.05em;
//         }

//         .tree-container {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           overflow-x: auto;
//           padding: 24px 0 12px 0;
//         }

//         .message {
//           color: #8b949e;
//           width: 100%;
//           text-align: center;
//           font-size: 0.9rem;
//         }

//         .highlight-cmd {
//           color: #58a6ff;
//           font-family: 'JetBrains Mono', monospace;
//         }

//         .dots-row {
//           display: flex;
//           align-items: flex-start;
//           padding: 10px 10px 40px 10px;
//         }

//         .dot-wrapper {
//           display: flex;
//           align-items: center;
//           position: relative;
//         }

//         .neon-dot {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: #38bdf8;
//           box-shadow: 0 0 15px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           z-index: 2;
//           transition: all 0.3s ease;
//         }

//         .neon-dot.pushed {
//           background: #27c93f;
//           box-shadow: 0 0 15px #27c93f, 0 0 30px rgba(39, 201, 63, 0.5);
//         }

//         .inner-light {
//           width: 8px;
//           height: 8px;
//           background: #ffffff;
//           border-radius: 50%;
//         }

//         .glow-line {
//           width: 70px;
//           height: 3px;
//           background: #38bdf8;
//           box-shadow: 0 0 10px #38bdf8;
//           z-index: 1;
//           transition: all 0.3s ease;
//         }

//         .glow-line.pushed {
//           background: #27c93f;
//           box-shadow: 0 0 10px #27c93f;
//         }

//         .dot-text {
//           position: absolute;
//           top: 38px;
//           left: -20px;
//           width: 68px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//         }

//         .dot-text .hash {
//           color: #58a6ff;
//           font-size: 0.72rem;
//           font-family: 'JetBrains Mono', monospace;
//           font-weight: 600;
//         }

//         .dot-text .msg {
//           color: #c9d1d9;
//           font-size: 0.75rem;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           max-width: 75px;
//         }

//         .bottom-layout {
//           display: flex;
//           gap: 20px;
//           min-height: 280px;
//         }

//         .terminal-card {
//           flex: 6;
//           background: #010409;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 14px;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
//           overflow: hidden;
//         }

//         .terminal-header {
//           background: #161b22;
//           padding: 10px 16px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .window-buttons {
//           display: flex;
//           gap: 6px;
//         }

//         .btn {
//           width: 10px;
//           height: 10px;
//           border-radius: 50%;
//         }
//         .btn.red { background: #ff5f56; }
//         .btn.yellow { background: #ffbd2e; }
//         .btn.green { background: #27c93f; }

//         .terminal-header .title {
//           color: #8b949e;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.78rem;
//           margin-left: 12px;
//         }

//         .terminal-logs {
//           flex: 1;
//           padding: 16px;
//           max-height: 220px;
//           overflow-y: auto;
//           font-family: 'JetBrains Mono', monospace;
//           color: #c9d1d9;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//           font-size: 0.85rem;
//         }

//         .cmd-prompt {
//           color: #58a6ff;
//           font-weight: bold;
//         }

//         .state-sidebar {
//           flex: 4;
//           background: rgba(22, 27, 34, 0.85);
//           border: 1px solid rgba(110, 86, 207, 0.3);
//           border-radius: 14px;
//           padding: 14px;
//           display: flex;
//           flex-direction: column;
//           backdrop-filter: blur(12px);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
//         }

//         .sidebar-nav {
//           display: flex;
//           background: #0d1117;
//           padding: 3px;
//           border-radius: 8px;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           margin-bottom: 12px;
//           gap: 2px;
//         }

//         .nav-btn {
//           flex: 1;
//           background: transparent;
//           border: none;
//           color: #8b949e;
//           font-size: 0.72rem;
//           font-weight: 600;
//           padding: 6px 0;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .nav-btn:hover {
//           color: #ffffff;
//           background: rgba(255, 255, 255, 0.05);
//         }

//         .nav-btn.active {
//           color: #ffffff;
//           background: linear-gradient(135deg, #6e56cf 0%, #58a6ff 100%);
//           box-shadow: 0 0 10px rgba(110, 86, 207, 0.4);
//         }

//         .tab-content {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           flex: 1;
//         }

//         .fade-in {
//           animation: fadeIn 0.3s ease-in-out;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(4px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .sidebar-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 4px;
//         }

//         .sidebar-header h3 {
//           color: #f0f6fc;
//           margin: 0;
//           font-size: 0.9rem;
//         }

//         .status-indicator {
//           font-size: 0.62rem;
//           color: #34d399;
//           background: rgba(52, 211, 153, 0.1);
//           padding: 2px 8px;
//           border-radius: 10px;
//           border: 1px solid rgba(52, 211, 153, 0.3);
//           font-weight: 600;
//         }

//         .status-indicator.info {
//           color: #58a6ff;
//           background: rgba(88, 166, 255, 0.1);
//           border-color: rgba(88, 166, 255, 0.3);
//         }

//         .flow-step {
//           background: #0d1117;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 8px;
//           padding: 6px 10px;
//           display: flex;
//           flex-direction: column;
//           gap: 1px;
//         }

//         .step-label {
//           color: #8b949e;
//           font-size: 0.65rem;
//           text-transform: uppercase;
//         }

//         .step-value {
//           color: #8b949e;
//           font-size: 0.78rem;
//           font-weight: 600;
//         }

//         .step-value.active { color: #58a6ff; }
//         .step-value.pushed { color: #34d399; }

//         .flow-arrow {
//           text-align: center;
//           color: #6e56cf;
//           font-size: 0.75rem;
//           line-height: 1;
//         }

//         .info-box {
//           background: #0d1117;
//           border: 1px solid rgba(110, 86, 207, 0.3);
//           border-radius: 8px;
//           padding: 12px;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .info-cmd {
//           color: #58a6ff;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.8rem;
//           font-weight: bold;
//         }

//         .info-desc {
//           color: #c9d1d9;
//           font-size: 0.78rem;
//           line-height: 1.4;
//         }

//         .guide-list {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .guide-item {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: #0d1117;
//           padding: 6px 10px;
//           border-radius: 8px;
//           border: 1px solid rgba(255, 255, 255, 0.05);
//         }

//         .guide-item .num {
//           background: rgba(110, 86, 207, 0.3);
//           color: #c084fc;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 0.7rem;
//           font-weight: bold;
//         }

//         .guide-item code {
//           color: #58a6ff;
//           font-size: 0.78rem;
//           font-weight: bold;
//           font-family: 'JetBrains Mono', monospace;
//         }

//         .guide-item p {
//           color: #8b949e;
//           font-size: 0.68rem;
//           margin: 0;
//         }

//         .about-box {
//           background: #0d1117;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 8px;
//           padding: 12px;
//           color: #c9d1d9;
//           font-size: 0.78rem;
//           line-height: 1.5;
//         }

//         @media (max-width: 768px) {
//           .bottom-layout {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }


// import React, { useState, useEffect } from "react";

// export default function Play({ commandToExecute }) {
//   // States
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [hasStaged, setHasStaged] = useState(false);
//   const [commits, setCommits] = useState([]);
//   const [logs, setLogs] = useState([
//     "Welcome! Type commands in the CLI input bar: git init, git add ., git commit -m \"msg\", git push"
//   ]);
//   const [lastExecutedCmd, setLastExecutedCmd] = useState("");
//   const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'learn' | 'command' | 'about'

//   // Command Processing Logic
//   const processCommand = (cmdText) => {
//     const cmd = cmdText.trim();
//     if (!cmd) return;

//     setLastExecutedCmd(cmd);
//     let newLogs = [...logs, `$ ${cmd}`];

//     if (cmd === "git init") {
//       setIsInitialized(true);
//       newLogs.push("Initialized empty Git repository in .git/");
//     } 
//     else if (cmd === "git add .") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository (or any of the parent directories): .git");
//       } else {
//         setHasStaged(true);
//         newLogs.push("Changes staged for commit.");
//       }
//     } 
//     else if (cmd.startsWith("git commit")) {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (!hasStaged) {
//         newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
//       } else {
//         const msgMatch = cmd.split("-m")[1];
//         const msg = msgMatch ? msgMatch.replace(/["']/g, "").trim() : "New Commit";
//         const newCommit = {
//           id: Math.random().toString(36).substring(2, 7),
//           msg: msg || "Commit node",
//           pushed: false
//         };
//         setCommits((prev) => [...prev, newCommit]);
//         setHasStaged(false);
//         newLogs.push(`[main ${newCommit.id}] ${msg}`);
//       }
//     } 
//     else if (cmd === "git push") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (commits.length === 0) {
//         newLogs.push("Everything up-to-date");
//       } else {
//         setCommits((prev) => prev.map((c) => ({ ...c, pushed: true })));
//         newLogs.push("Successfully pushed local commits to origin/main!");
//       }
//     } 
//     else {
//       newLogs.push(`Command not recognized: '${cmd}'`);
//     }

//     setLogs(newLogs);
//   };

//   // Process incoming command from App.jsx parent component
//   useEffect(() => {
//     if (commandToExecute) {
//       processCommand(commandToExecute);
//     }
//   }, [commandToExecute]);

//   // Dynamic Command Helper for Learn Tab
//   const getCommandExplanation = (cmd) => {
//     if (!cmd) return "Run any Git command in the input bar above to see its real-time explanation here!";
//     if (cmd === "git init") {
//       return "git init: Initializes a new hidden '.git' directory in your project folder, turning it into a tracked Git repository.";
//     }
//     if (cmd === "git add .") {
//       return "git add .: Moves modified and untracked files from Working Directory to the Staging Area, preparing them for snapshotting.";
//     }
//     if (cmd.startsWith("git commit")) {
//       return "git commit -m 'msg': Captures a permanent snapshot node of all staged files in the local repository chain with a commit message.";
//     }
//     if (cmd === "git push") {
//       return "git push: Uploads local branch commits to the remote repository (e.g. GitHub), updating remote refs.";
//     }
//     return `Executed '${cmd}'. This command inspects or alters your current workspace state graph.`;
//   };

//   return (
//     <div className="play-container">
//       {/* 1. VISUALIZER TREE (TOP SECTION) */}
//       <div className="playground-full">
//         <div className="playground-title">
//           <span className="badge">LIVE TREE PLAYGROUND</span>
//           <h2>Git Commit Nodes Visualizer</h2>
//         </div>

//         <div className="tree-container">
//           {!isInitialized ? (
//             <div className="message">
//               Type <b className="highlight-cmd">git init</b> in the input bar to initialize repository visualizer
//             </div>
//           ) : commits.length === 0 ? (
//             <div className="message">
//               Run <b className="highlight-cmd">git add .</b> then <b className="highlight-cmd">git commit -m "msg"</b> to spawn nodes!
//             </div>
//           ) : (
//             <div className="dots-row">
//               {commits.map((commit, index) => (
//                 <div key={commit.id} className="dot-wrapper">
//                   <div className={`neon-dot ${commit.pushed ? "pushed" : ""}`}>
//                     <div className="inner-light"></div>
//                   </div>

//                   <div className="dot-text">
//                     <span className="hash">#{commit.id}</span>
//                     <span className="msg" title={commit.msg}>{commit.msg}</span>
//                   </div>

//                   {index < commits.length - 1 && <div className={`glow-line ${commit.pushed ? "pushed" : ""}`}></div>}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. BOTTOM SECTION (TERMINAL LOGS + SIDEBAR) */}
//       <div className="bottom-layout">
//         {/* Terminal Logs Output Card */}
//         <div className="terminal-card">
//           <div className="terminal-header">
//             <div className="window-buttons">
//               <span className="btn red"></span>
//               <span className="btn yellow"></span>
//               <span className="btn green"></span>
//             </div>
//             <span className="title">bash — git output terminal</span>
//           </div>

//           <div className="terminal-logs">
//             {logs.map((log, index) => (
//               <div key={index} className="log-line">
//                 {log.startsWith("$") ? <span className="cmd-prompt">{log}</span> : log}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Tabbed State Sidebar */}
//         <div className="state-sidebar">
//           {/* Sidebar Nav Header */}
//           <div className="sidebar-nav">
//             <button
//               className={`nav-btn ${activeTab === "dashboard" ? "active" : ""}`}
//               onClick={() => setActiveTab("dashboard")}
//             >
//               Dashboard
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "learn" ? "active" : ""}`}
//               onClick={() => setActiveTab("learn")}
//             >
//               Learn
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "command" ? "active" : ""}`}
//               onClick={() => setActiveTab("command")}
//             >
//               Command
//             </button>
//             <button
//               className={`nav-btn ${activeTab === "about" ? "active" : ""}`}
//               onClick={() => setActiveTab("about")}
//             >
//               About
//             </button>
//           </div>

//           {/* TAB 1: DASHBOARD */}
//           {activeTab === "dashboard" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>State & Flow</h3>
//                 <span className="status-indicator">ACTIVE</span>
//               </div>

//               <div className="flow-step">
//                 <span className="step-label">Repository Status</span>
//                 <div className={`step-value ${isInitialized ? "active" : ""}`}>
//                   {isInitialized ? "Initialized (.git)" : "Not Initialized"}
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Staging Area</span>
//                 <div className={`step-value ${hasStaged ? "active" : ""}`}>
//                   {hasStaged ? "Changes Staged" : "Clean Working Tree"}
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Commits Tracked</span>
//                 <div className="step-value active">
//                   {commits.length} Commit{commits.length !== 1 ? "s" : ""} Created
//                 </div>
//               </div>

//               <div className="flow-arrow">↓</div>

//               <div className="flow-step">
//                 <span className="step-label">Remote Push Status</span>
//                 <div className={`step-value ${commits.some((c) => c.pushed) ? "pushed" : ""}`}>
//                   {commits.length === 0
//                     ? "No Commits"
//                     : commits.every((c) => c.pushed)
//                     ? "Synced with Remote"
//                     : "Unpushed Commits Exist"}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 2: LEARN */}
//           {activeTab === "learn" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>Command Explanation</h3>
//                 <span className="status-indicator info">LEARN</span>
//               </div>
//               <div className="info-box">
//                 <span className="info-cmd">
//                   {lastExecutedCmd ? `$ ${lastExecutedCmd}` : "No Command Run Yet"}
//                 </span>
//                 <p className="info-desc">{getCommandExplanation(lastExecutedCmd)}</p>
//               </div>
//             </div>
//           )}

//           {/* TAB 3: COMMAND (GUIDE) */}
//           {activeTab === "command" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>Step-by-Step Commands</h3>
//                 <span className="status-indicator">GUIDE</span>
//               </div>
//               <div className="guide-list">
//                 <div className="guide-item">
//                   <span className="num">1</span>
//                   <div>
//                     <code>git init</code>
//                     <p>Initialize empty local repository</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">2</span>
//                   <div>
//                     <code>git add .</code>
//                     <p>Stage working directory files</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">3</span>
//                   <div>
//                     <code>git commit -m "msg"</code>
//                     <p>Create visual node snapshot</p>
//                   </div>
//                 </div>
//                 <div className="guide-item">
//                   <span className="num">4</span>
//                   <div>
//                     <code>git push</code>
//                     <p>Sync commits to remote branch</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* TAB 4: ABOUT */}
//           {activeTab === "about" && (
//             <div className="tab-content fade-in">
//               <div className="sidebar-header">
//                 <h3>About Visualizer</h3>
//               </div>
//               <div className="about-box">
//                 <p>
//                   <b>Commit Canvas</b> is an interactive playground that converts terminal commands into live glowing DAG commit nodes.
//                 </p>
//                 <p style={{ marginTop: "8px" }}>
//                   Designed to help developers master staging flow, node commit tracking, and branch pushing visually.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Embedded CSS matching App.jsx design tokens */}
//       <style>{`
//         .play-container {
//           width: 100%;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           box-sizing: border-box;
//         }

//         .playground-full {
//           width: 100%;
//           min-height: 220px;
//           background: rgba(22, 27, 34, 0.75);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid rgba(110, 86, 207, 0.35);
//           border-radius: 16px;
//           padding: 20px 24px;
//           box-sizing: border-box;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
//           display: flex;
//           flex-direction: column;
//         }

//         .playground-title {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .playground-title h2 {
//           color: #ffffff;
//           margin: 0;
//           font-size: 1.2rem;
//           font-weight: 600;
//           letter-spacing: -0.02em;
//         }

//         .badge {
//           background: rgba(110, 86, 207, 0.2);
//           border: 1px solid #8957e5;
//           color: #c084fc;
//           padding: 3px 10px;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           font-weight: 700;
//           letter-spacing: 0.05em;
//         }

//         .tree-container {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           overflow-x: auto;
//           padding: 24px 0 12px 0;
//         }

//         .message {
//           color: #8b949e;
//           width: 100%;
//           text-align: center;
//           font-size: 0.9rem;
//         }

//         .highlight-cmd {
//           color: #58a6ff;
//           font-family: 'JetBrains Mono', monospace;
//         }

//         .dots-row {
//           display: flex;
//           align-items: flex-start;
//           padding: 10px 10px 40px 10px;
//         }

//         .dot-wrapper {
//           display: flex;
//           align-items: center;
//           position: relative;
//         }

//         .neon-dot {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: #38bdf8;
//           box-shadow: 0 0 15px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           z-index: 2;
//           transition: all 0.3s ease;
//         }

//         .neon-dot.pushed {
//           background: #27c93f;
//           box-shadow: 0 0 15px #27c93f, 0 0 30px rgba(39, 201, 63, 0.5);
//         }

//         .inner-light {
//           width: 8px;
//           height: 8px;
//           background: #ffffff;
//           border-radius: 50%;
//         }

//         .glow-line {
//           width: 70px;
//           height: 3px;
//           background: #38bdf8;
//           box-shadow: 0 0 10px #38bdf8;
//           z-index: 1;
//           transition: all 0.3s ease;
//         }

//         .glow-line.pushed {
//           background: #27c93f;
//           box-shadow: 0 0 10px #27c93f;
//         }

//         .dot-text {
//           position: absolute;
//           top: 38px;
//           left: -20px;
//           width: 68px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//         }

//         .dot-text .hash {
//           color: #58a6ff;
//           font-size: 0.72rem;
//           font-family: 'JetBrains Mono', monospace;
//           font-weight: 600;
//         }

//         .dot-text .msg {
//           color: #c9d1d9;
//           font-size: 0.75rem;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           max-width: 75px;
//         }

//         .bottom-layout {
//           display: flex;
//           gap: 20px;
//           min-height: 280px;
//         }

//         .terminal-card {
//           flex: 6;
//           background: #010409;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 14px;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
//           overflow: hidden;
//         }

//         .terminal-header {
//           background: #161b22;
//           padding: 10px 16px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .window-buttons {
//           display: flex;
//           gap: 6px;
//         }

//         .btn {
//           width: 10px;
//           height: 10px;
//           border-radius: 50%;
//         }
//         .btn.red { background: #ff5f56; }
//         .btn.yellow { background: #ffbd2e; }
//         .btn.green { background: #27c93f; }

//         .terminal-header .title {
//           color: #8b949e;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.78rem;
//           margin-left: 12px;
//         }

//         .terminal-logs {
//           flex: 1;
//           padding: 16px;
//           max-height: 220px;
//           overflow-y: auto;
//           font-family: 'JetBrains Mono', monospace;
//           color: #c9d1d9;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//           font-size: 0.85rem;
//         }

//         .cmd-prompt {
//           color: #58a6ff;
//           font-weight: bold;
//         }

//         .state-sidebar {
//           flex: 4;
//           background: rgba(22, 27, 34, 0.85);
//           border: 1px solid rgba(110, 86, 207, 0.3);
//           border-radius: 14px;
//           padding: 14px;
//           display: flex;
//           flex-direction: column;
//           backdrop-filter: blur(12px);
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
//         }

//         .sidebar-nav {
//           display: flex;
//           background: #0d1117;
//           padding: 3px;
//           border-radius: 8px;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           margin-bottom: 12px;
//           gap: 2px;
//         }

//         .nav-btn {
//           flex: 1;
//           background: transparent;
//           border: none;
//           color: #8b949e;
//           font-size: 0.72rem;
//           font-weight: 600;
//           padding: 6px 0;
//           border-radius: 6px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .nav-btn:hover {
//           color: #ffffff;
//           background: rgba(255, 255, 255, 0.05);
//         }

//         .nav-btn.active {
//           color: #ffffff;
//           background: linear-gradient(135deg, #6e56cf 0%, #58a6ff 100%);
//           box-shadow: 0 0 10px rgba(110, 86, 207, 0.4);
//         }

//         .tab-content {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//           flex: 1;
//         }

//         .fade-in {
//           animation: fadeIn 0.3s ease-in-out;
//         }

//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(4px); }
//           to { opacity: 1; transform: translateY(0); }
//         }

//         .sidebar-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 4px;
//         }

//         .sidebar-header h3 {
//           color: #f0f6fc;
//           margin: 0;
//           font-size: 0.9rem;
//         }

//         .status-indicator {
//           font-size: 0.62rem;
//           color: #34d399;
//           background: rgba(52, 211, 153, 0.1);
//           padding: 2px 8px;
//           border-radius: 10px;
//           border: 1px solid rgba(52, 211, 153, 0.3);
//           font-weight: 600;
//         }

//         .status-indicator.info {
//           color: #58a6ff;
//           background: rgba(88, 166, 255, 0.1);
//           border-color: rgba(88, 166, 255, 0.3);
//         }

//         .flow-step {
//           background: #0d1117;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 8px;
//           padding: 6px 10px;
//           display: flex;
//           flex-direction: column;
//           gap: 1px;
//         }

//         .step-label {
//           color: #8b949e;
//           font-size: 0.65rem;
//           text-transform: uppercase;
//         }

//         .step-value {
//           color: #8b949e;
//           font-size: 0.78rem;
//           font-weight: 600;
//         }

//         .step-value.active { color: #58a6ff; }
//         .step-value.pushed { color: #34d399; }

//         .flow-arrow {
//           text-align: center;
//           color: #6e56cf;
//           font-size: 0.75rem;
//           line-height: 1;
//         }

//         .info-box {
//           background: #0d1117;
//           border: 1px solid rgba(110, 86, 207, 0.3);
//           border-radius: 8px;
//           padding: 12px;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .info-cmd {
//           color: #58a6ff;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.8rem;
//           font-weight: bold;
//         }

//         .info-desc {
//           color: #c9d1d9;
//           font-size: 0.78rem;
//           line-height: 1.4;
//         }

//         .guide-list {
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//         }

//         .guide-item {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           background: #0d1117;
//           padding: 6px 10px;
//           border-radius: 8px;
//           border: 1px solid rgba(255, 255, 255, 0.05);
//         }

//         .guide-item .num {
//           background: rgba(110, 86, 207, 0.3);
//           color: #c084fc;
//           width: 20px;
//           height: 20px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-size: 0.7rem;
//           font-weight: bold;
//         }

//         .guide-item code {
//           color: #58a6ff;
//           font-size: 0.78rem;
//           font-weight: bold;
//           font-family: 'JetBrains Mono', monospace;
//         }

//         .guide-item p {
//           color: #8b949e;
//           font-size: 0.68rem;
//           margin: 0;
//         }

//         .about-box {
//           background: #0d1117;
//           border: 1px solid rgba(255, 255, 255, 0.08);
//           border-radius: 8px;
//           padding: 12px;
//           color: #c9d1d9;
//           font-size: 0.78rem;
//           line-height: 1.5;
//         }

//         @media (max-width: 768px) {
//           .bottom-layout {
//             flex-direction: column;
//           }
//         }
//       `}</style>
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";

// export default function Play({ commandToExecute }) {
//   // States
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [hasStaged, setHasStaged] = useState(false);
//   const [commits, setCommits] = useState([]);
//   const [logs, setLogs] = useState([
//     "Welcome! Type commands in the CLI input bar: git init, git add ., git commit -m \"msg\", git push"
//   ]);

//   // Command Processing Logic
//   const processCommand = (cmdText) => {
//     const cmd = cmdText.trim();
//     if (!cmd) return;

//     let newLogs = [...logs, `$ ${cmd}`];

//     if (cmd === "git init") {
//       setIsInitialized(true);
//       newLogs.push("Initialized empty Git repository in .git/");
//     } 
//     else if (cmd === "git add .") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository (or any of the parent directories): .git");
//       } else {
//         setHasStaged(true);
//         newLogs.push("Changes staged for commit.");
//       }
//     } 
//     else if (cmd.startsWith("git commit")) {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (!hasStaged) {
//         newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
//       } else {
//         const msgMatch = cmd.split("-m")[1];
//         const msg = msgMatch ? msgMatch.replace(/["']/g, "").trim() : "New Commit";
//         const newCommit = {
//           id: Math.random().toString(36).substring(2, 7),
//           msg: msg || "Commit node",
//           pushed: false
//         };
//         setCommits((prev) => [...prev, newCommit]);
//         setHasStaged(false);
//         newLogs.push(`[main ${newCommit.id}] ${msg}`);
//       }
//     } 
//     else if (cmd === "git push") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (commits.length === 0) {
//         newLogs.push("Everything up-to-date");
//       } else {
//         setCommits((prev) => prev.map((c) => ({ ...c, pushed: true })));
//         newLogs.push("Successfully pushed local commits to origin/main!");
//       }
//     } 
//     else {
//       newLogs.push(`Command not recognized: '${cmd}'`);
//     }

//     setLogs(newLogs);
//   };

//   // Process incoming command from App.jsx parent component
//   useEffect(() => {
//     if (commandToExecute) {
//       processCommand(commandToExecute);
//     }
//   }, [commandToExecute]);

//   return (
//     <div className="play-container">
//       {/* 1. VISUALIZER TREE WITH FLOATING NAVBAR (TOP SECTION) */}
//       <div className="playground-full">
//         {/* Integrated Floating Pill Navbar */}
//         <div className="top-floating-navbar">
//           <div className="nav-logo-icon">
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <circle cx="12" cy="12" r="3" />
//               <path d="M3 12h6m6 0h6" />
//             </svg>
//           </div>
//           <div className="nav-items-group">
//             <span className="nav-link">Work</span>
//             <span className="nav-link">About</span>
//             <span className="nav-link active">Playground</span>
//             <span className="nav-link">Resource</span>
//           </div>
//         </div>

//         <div className="playground-title">
//           <span className="badge">LIVE TREE PLAYGROUND</span>
//           <h2>Git Commit Nodes Visualizer</h2>
//         </div>

//         <div className="tree-container">
//           {!isInitialized ? (
//             <div className="message">
//               Type <b className="highlight-cmd">git init</b> in the input bar to initialize repository visualizer
//             </div>
//           ) : commits.length === 0 ? (
//             <div className="message">
//               Run <b className="highlight-cmd">git add .</b> then <b className="highlight-cmd">git commit -m "msg"</b> to spawn nodes!
//             </div>
//           ) : (
//             <div className="dots-row">
//               {commits.map((commit, index) => (
//                 <div key={commit.id} className="dot-wrapper">
//                   <div className={`neon-dot ${commit.pushed ? "pushed" : ""}`}>
//                     <div className="inner-light"></div>
//                   </div>

//                   <div className="dot-text">
//                     <span className="hash">#{commit.id}</span>
//                     <span className="msg" title={commit.msg}>{commit.msg}</span>
//                   </div>

//                   {index < commits.length - 1 && <div className={`glow-line ${commit.pushed ? "pushed" : ""}`}></div>}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. BOTTOM SECTION (EXPANDED FULL-WIDTH TERMINAL LOGS) */}
//       <div className="bottom-layout">
//         <div className="terminal-card">
//           <div className="terminal-header">
//             <div className="window-buttons">
//               <span className="btn red"></span>
//               <span className="btn yellow"></span>
//               <span className="btn green"></span>
//             </div>
//             <span className="title">bash — git output terminal</span>
//           </div>

//           <div className="terminal-logs">
//             {logs.map((log, index) => (
//               <div key={index} className="log-line">
//                 {log.startsWith("$") ? <span className="cmd-prompt">{log}</span> : log}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Embedded CSS matching App.jsx design tokens */}
//       <style>{`
//         .play-container {
//           width: 100%;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           box-sizing: border-box;
//         }

//         .playground-full {
//           width: 100%;
//           min-height: 280px;
//           background: rgba(22, 27, 34, 0.75);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid rgba(110, 86, 207, 0.35);
//           border-radius: 16px;
//           padding: 20px 24px;
//           box-sizing: border-box;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           position: relative;
//         }

//         /* Integrated Pill Nav bar Styling */
//         .top-floating-navbar {
//           align-self: center;
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           background: rgba(13, 17, 23, 0.85);
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 30px;
//           padding: 6px 18px;
//           margin-bottom: 20px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
//         }

//         .nav-logo-icon {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #ffffff;
//         }

//         .nav-items-group {
//           display: flex;
//           align-items: center;
//           gap: 18px;
//         }

//         .nav-link {
//           color: #8b949e;
//           font-size: 0.82rem;
//           font-weight: 500;
//           cursor: pointer;
//           transition: color 0.2s ease;
//         }

//         .nav-link:hover, .nav-link.active {
//           color: #ffffff;
//           font-weight: 600;
//         }

//         .playground-title {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .playground-title h2 {
//           color: #ffffff;
//           margin: 0;
//           font-size: 1.2rem;
//           font-weight: 600;
//           letter-spacing: -0.02em;
//         }

//         .badge {
//           background: rgba(110, 86, 207, 0.2);
//           border: 1px solid #8957e5;
//           color: #c084fc;
//           padding: 3px 10px;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           font-weight: 700;
//           letter-spacing: 0.05em;
//         }

//         .tree-container {
//           width: 100%;
//           flex: 1;
//           display: flex;
//           align-items: center;
//           overflow-x: auto;
//           padding: 24px 0 12px 0;
//         }

//         .message {
//           color: #8b949e;
//           width: 100%;
//           text-align: center;
//           font-size: 0.9rem;
//         }

//         .highlight-cmd {
//           color: #58a6ff;
//           font-family: 'JetBrains Mono', monospace;
//         }

//         .dots-row {
//           display: flex;
//           align-items: flex-start;
//           padding: 10px 10px 40px 10px;
//         }

//         .dot-wrapper {
//           display: flex;
//           align-items: center;
//           position: relative;
//         }

//         .neon-dot {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: #38bdf8;
//           box-shadow: 0 0 15px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           z-index: 2;
//           transition: all 0.3s ease;
//         }

//         .neon-dot.pushed {
//           background: #27c93f;
//           box-shadow: 0 0 15px #27c93f, 0 0 30px rgba(39, 201, 63, 0.5);
//         }

//         .inner-light {
//           width: 8px;
//           height: 8px;
//           background: #ffffff;
//           border-radius: 50%;
//         }

//         .glow-line {
//           width: 70px;
//           height: 3px;
//           background: #38bdf8;
//           box-shadow: 0 0 10px #38bdf8;
//           z-index: 1;
//           transition: all 0.3s ease;
//         }

//         .glow-line.pushed {
//           background: #27c93f;
//           box-shadow: 0 0 10px #27c93f;
//         }

//         .dot-text {
//           position: absolute;
//           top: 38px;
//           left: -20px;
//           width: 68px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//         }

//         .dot-text .hash {
//           color: #58a6ff;
//           font-size: 0.72rem;
//           font-family: 'JetBrains Mono', monospace;
//           font-weight: 600;
//         }

//         .dot-text .msg {
//           color: #c9d1d9;
//           font-size: 0.75rem;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           max-width: 75px;
//         }

//         .bottom-layout {
//           width: 100%;
//           display: flex;
//           min-height: 280px;
//         }

//         /* Full Width Terminal */
//         .terminal-card {
//           width: 100%;
//           background: #010409;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 14px;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
//           overflow: hidden;
//         }

//         .terminal-header {
//           background: #161b22;
//           padding: 10px 16px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .window-buttons {
//           display: flex;
//           gap: 6px;
//         }

//         .btn {
//           width: 10px;
//           height: 10px;
//           border-radius: 50%;
//         }
//         .btn.red { background: #ff5f56; }
//         .btn.yellow { background: #ffbd2e; }
//         .btn.green { background: #27c93f; }

//         .terminal-header .title {
//           color: #8b949e;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.78rem;
//           margin-left: 12px;
//         }

//         .terminal-logs {
//           flex: 1;
//           padding: 16px;
//           max-height: 260px;
//           overflow-y: auto;
//           font-family: 'JetBrains Mono', monospace;
//           color: #c9d1d9;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//           font-size: 0.85rem;
//         }

//         .cmd-prompt {
//           color: #58a6ff;
//           font-weight: bold;
//         }
//       `}</style>
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";

// export default function Play({ commandToExecute }) {
//   // Global & Interactive States
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [hasStaged, setHasStaged] = useState(false);
//   const [commits, setCommits] = useState([]);
//   const [logs, setLogs] = useState([
//     "Welcome! Type commands in the CLI input bar: git init, git add ., git commit -m \"msg\", git push"
//   ]);

//   // Command Processing Logic
//   const processCommand = (cmdText) => {
//     const cmd = cmdText.trim();
//     if (!cmd) return;

//     let newLogs = [...logs, `$ ${cmd}`];

//     if (cmd === "git init") {
//       setIsInitialized(true);
//       newLogs.push("Initialized empty Git repository in .git/");
//     } 
//     else if (cmd === "git add .") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository (or any of the parent directories): .git");
//       } else {
//         setHasStaged(true);
//         newLogs.push("Changes staged for commit.");
//       }
//     } 
//     else if (cmd.startsWith("git commit")) {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (!hasStaged) {
//         newLogs.push("Nothing to commit, working tree clean. Run 'git add .' first.");
//       } else {
//         const msgMatch = cmd.split("-m")[1];
//         const msg = msgMatch ? msgMatch.replace(/["']/g, "").trim() : "New Commit";
//         const newCommit = {
//           id: Math.random().toString(36).substring(2, 7),
//           msg: msg || "Commit node",
//           pushed: false
//         };
//         setCommits((prev) => [...prev, newCommit]);
//         setHasStaged(false);
//         newLogs.push(`[main ${newCommit.id}] ${msg}`);
//       }
//     } 
//     else if (cmd === "git push") {
//       if (!isInitialized) {
//         newLogs.push("fatal: not a git repository");
//       } else if (commits.length === 0) {
//         newLogs.push("Everything up-to-date");
//       } else {
//         setCommits((prev) => prev.map((c) => ({ ...c, pushed: true })));
//         newLogs.push("Successfully pushed local commits to origin/main!");
//       }
//     } 
//     else {
//       newLogs.push(`Command not recognized: '${cmd}'`);
//     }

//     setLogs(newLogs);
//   };

//   // Process incoming command from App.jsx parent component
//   useEffect(() => {
//     if (commandToExecute) {
//       processCommand(commandToExecute);
//     }
//   }, [commandToExecute]);

//   return (
//     <div className="play-container">
//       {/* 1. VISUALIZER TREE WITH FLOATING NAVBAR */}
//       <div className="playground-full">
//         <div className="top-floating-navbar">
//           <div className="nav-logo-icon">
//             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//               <circle cx="12" cy="12" r="3" />
//               <path d="M3 12h6m6 0h6" />
//             </svg>
//           </div>
//           <div className="nav-items-group">
//             <span className="nav-link">Work</span>
//             <span className="nav-link">About</span>
//             <span className="nav-link active">Playground</span>
//             <span className="nav-link">Resource</span>
//           </div>
//         </div>

//         <div className="playground-title">
//           <span className="badge">LIVE TREE PLAYGROUND</span>
//           <h2>Git Commit Nodes Visualizer</h2>
//         </div>

//         <div className="tree-container">
//           {!isInitialized ? (
//             <div className="message">
//               Type <b className="highlight-cmd">git init</b> in the input bar to initialize repository visualizer
//             </div>
//           ) : commits.length === 0 ? (
//             <div className="message">
//               Run <b className="highlight-cmd">git add .</b> then <b className="highlight-cmd">git commit -m "msg"</b> to spawn nodes!
//             </div>
//           ) : (
//             <div className="dots-row">
//               {commits.map((commit, index) => (
//                 <div key={commit.id} className="dot-wrapper">
//                   <div className={`neon-dot ${commit.pushed ? "pushed" : ""}`}>
//                     <div className="inner-light"></div>
//                   </div>

//                   <div className="dot-text">
//                     <span className="hash">#{commit.id}</span>
//                     <span className="msg" title={commit.msg}>{commit.msg}</span>
//                   </div>

//                   {index < commits.length - 1 && <div className={`glow-line ${commit.pushed ? "pushed" : ""}`}></div>}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* 2. TERMINAL SECTION */}
//       <div className="bottom-layout">
//         <div className="terminal-card">
//           <div className="terminal-header">
//             <div className="window-buttons">
//               <span className="btn red"></span>
//               <span className="btn yellow"></span>
//               <span className="btn green"></span>
//             </div>
//             <span className="title">bash — git output terminal</span>
//           </div>

//           <div className="terminal-logs">
//             {logs.map((log, index) => (
//               <div key={index} className="log-line">
//                 {log.startsWith("$") ? <span className="cmd-prompt">{log}</span> : log}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CSS Styles */}
//       <style>{`
//         .play-container {
//           width: 100%;
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//           box-sizing: border-box;
//         }

//         .playground-full {
//           width: 100%;
//           min-height: 280px;
//           background: rgba(22, 27, 34, 0.75);
//           backdrop-filter: blur(16px);
//           -webkit-backdrop-filter: blur(16px);
//           border: 1px solid rgba(110, 86, 207, 0.35);
//           border-radius: 16px;
//           padding: 20px 24px;
//           box-sizing: border-box;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           position: relative;
//         }

//         .top-floating-navbar {
//           align-self: center;
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           background: rgba(13, 17, 23, 0.85);
//           border: 1px solid rgba(255, 255, 255, 0.12);
//           border-radius: 30px;
//           padding: 6px 18px;
//           margin-bottom: 20px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
//         }

//         .nav-logo-icon { display: flex; align-items: center; color: #ffffff; }
//         .nav-items-group { display: flex; align-items: center; gap: 18px; }

//         .nav-link {
//           color: #8b949e;
//           font-size: 0.82rem;
//           font-weight: 500;
//           cursor: pointer;
//           transition: color 0.2s ease;
//         }

//         .nav-link:hover, .nav-link.active { color: #ffffff; font-weight: 600; }

//         .playground-title { display: flex; align-items: center; gap: 12px; }
//         .playground-title h2 { color: #ffffff; margin: 0; font-size: 1.2rem; font-weight: 600; letter-spacing: -0.02em; }

//         .badge {
//           background: rgba(110, 86, 207, 0.2);
//           border: 1px solid #8957e5;
//           color: #c084fc;
//           padding: 3px 10px;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           font-weight: 700;
//           letter-spacing: 0.05em;
//         }

//         .tree-container {
//           width: 100%;
//           flex: 1;
//           display: flex;
//           align-items: center;
//           overflow-x: auto;
//           padding: 24px 0 12px 0;
//         }

//         .message { color: #8b949e; width: 100%; text-align: center; font-size: 0.9rem; }
//         .highlight-cmd { color: #58a6ff; font-family: 'JetBrains Mono', monospace; }

//         .dots-row { display: flex; align-items: flex-start; padding: 10px 10px 40px 10px; }
//         .dot-wrapper { display: flex; align-items: center; position: relative; }

//         .neon-dot {
//           width: 28px;
//           height: 28px;
//           border-radius: 50%;
//           background: #38bdf8;
//           box-shadow: 0 0 15px #38bdf8, 0 0 30px rgba(56, 189, 248, 0.5);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//           z-index: 2;
//           transition: all 0.3s ease;
//         }

//         .neon-dot.pushed { background: #27c93f; box-shadow: 0 0 15px #27c93f, 0 0 30px rgba(39, 201, 63, 0.5); }
//         .inner-light { width: 8px; height: 8px; background: #ffffff; border-radius: 50%; }

//         .glow-line {
//           width: 70px;
//           height: 3px;
//           background: #38bdf8;
//           box-shadow: 0 0 10px #38bdf8;
//           z-index: 1;
//           transition: all 0.3s ease;
//         }
//         .glow-line.pushed { background: #27c93f; box-shadow: 0 0 10px #27c93f; }

//         .dot-text {
//           position: absolute;
//           top: 38px;
//           left: -20px;
//           width: 68px;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           text-align: center;
//         }

//         .dot-text .hash { color: #58a6ff; font-size: 0.72rem; font-family: 'JetBrains Mono', monospace; font-weight: 600; }
//         .dot-text .msg { color: #c9d1d9; font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 75px; }

//         /* Terminal Styles */
//         .bottom-layout { width: 100%; display: flex; min-height: 220px; }

//         .terminal-card {
//           width: 100%;
//           background: #010409;
//           border: 1px solid rgba(255, 255, 255, 0.1);
//           border-radius: 14px;
//           display: flex;
//           flex-direction: column;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
//           overflow: hidden;
//         }

//         .terminal-header {
//           background: #161b22;
//           padding: 10px 16px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid rgba(255, 255, 255, 0.08);
//         }

//         .window-buttons { display: flex; gap: 6px; }
//         .btn { width: 10px; height: 10px; border-radius: 50%; }
//         .btn.red { background: #ff5f56; }
//         .btn.yellow { background: #ffbd2e; }
//         .btn.green { background: #27c93f; }

//         .terminal-header .title {
//           color: #8b949e;
//           font-family: 'JetBrains Mono', monospace;
//           font-size: 0.78rem;
//           margin-left: 12px;
//         }

//         .terminal-logs {
//           flex: 1;
//           padding: 16px;
//           max-height: 220px;
//           overflow-y: auto;
//           font-family: 'JetBrains Mono', monospace;
//           color: #c9d1d9;
//           display: flex;
//           flex-direction: column;
//           gap: 6px;
//           font-size: 0.85rem;
//         }

//         .cmd-prompt { color: #58a6ff; font-weight: bold; }
//       `}</style>
//     </div>
//   );
// }


// Play.jsx
import React, { useState, useEffect } from "react";
import "./Play.css";
import { initialLogs, processGitCommand } from "./gitLogic";

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
