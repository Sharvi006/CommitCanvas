
import React, { useState, useEffect } from 'react';
import Play from './components/Play/Play.jsx';
import Playground from './components/Playground/Playground.jsx';

export default function CommitCanvas() {
  // Main view state
  const [activeTab, setActiveTab] = useState('home');
  
  // Playground Navigation sub-tabs
  const [sideTab, setSideTab] = useState('dashboard');

  // Terminal & Command states
  const [commandInput, setCommandInput] = useState('');
  const [activeCommand, setActiveCommand] = useState('');
  const [executedLogs, setExecutedLogs] = useState([]);
  const [playgroundKey, setPlaygroundKey] = useState(0);

  // Live Git state shared with the Dashboard
  const [gitDashboardState, setGitDashboardState] = useState({
    isInitialized: false,
    hasStaged: false,
    commits: [],
    logs: []
  });

  // Dynamic Navbar Scroll Shrink State
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scrollytelling animations for Home page
  useEffect(() => {
    if (activeTab !== 'home') return;

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15 
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      elements.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, [activeTab]);

  // Command Execution Handler
  const handleRunCommand = (e) => {
    if (e) e.preventDefault();
    if (!commandInput.trim()) return;

    const cmd = commandInput.trim();
    setActiveCommand(cmd);
    setExecutedLogs((prev) => [...prev, cmd]);
    setCommandInput('');
  };

  // Reset Playground Handler
  const handleResetPlayground = () => {
    setCommandInput('');
    setActiveCommand('');
    setExecutedLogs([]);
    setGitDashboardState({
      isInitialized: false,
      hasStaged: false,
      commits: [],
      logs: []
    });
    setPlaygroundKey((prev) => prev + 1);
  };

  return (
    <>
      {/* Page Styles */}
      <style>{`
        :root {
            --bg-base: #0d1117;
            --bg-surface: #161b22;
            --bg-surface-elevated: #21262d;
            --text-primary: #c9d1d9;
            --text-secondary: #8b949e;
            --accent-blue: #58a6ff;
            --accent-green: #238636;
            --accent-purple: #8957e5;
            --accent-glow: #6e56cf;
            --border-color: rgba(255, 255, 255, 0.08);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            background-color: var(--bg-base);
            color: var(--text-primary);
            font-family: 'Inter', -apple-system, sans-serif;
            line-height: 1.5;
            overflow-x: hidden;
        }

        .blob-container {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            filter: blur(35px);
            z-index: -1;
            overflow: hidden;
            pointer-events: none;
        }

        .blob {
            position: absolute; opacity: 0.9;
            mix-blend-mode: multiply;
            animation: morphAndMove 15s infinite alternate ease-in-out;
        }

        .blob-1 { width: 45vw; height: 45vw; background-color: #CDB4DB; top: -10%; left: -10%; animation-delay: 0s; }
        .blob-2 { width: 55vw; height: 55vw; background-color: #FFC8DD; top: 20%; right: -10%; animation-delay: -4s; }
        .blob-3 { width: 40vw; height: 40vw; background-color: #FFAFCC; bottom: -10%; left: 10%; animation-delay: -8s; }
        .blob-4 { width: 50vw; height: 50vw; background-color: #BDE0FE; bottom: 10%; right: 20%; animation-delay: -12s; }
        .blob-5 { width: 35vw; height: 35vw; background-color: #A2D2FF; top: 30%; left: 30%; animation-delay: -16s; }

        @keyframes morphAndMove {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
            50% { transform: translate(15vw, 10vh) scale(1.1) rotate(90deg); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
            100% { transform: translate(-10vw, -15vh) scale(0.9) rotate(180deg); border-radius: 40% 60% 30% 70% / 60% 40% 70% 30%; }
        }

        /* Navigation Header */
        .navbar-wrapper { position: fixed; top: 24px; left: 0; right: 0; display: flex; justify-content: center; z-index: 100; transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .navbar-wrapper.shrunk { top: 12px; }
        .pill-nav { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 800px; height: 56px; background: rgba(22, 27, 34, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid var(--border-color); border-radius: 100px; padding: 0 12px; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .pill-nav.shrunk { max-width: 540px; height: 42px; padding: 0 8px; background: rgba(22, 27, 34, 0.88); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6); border-color: rgba(255, 255, 255, 0.15); }
        .pill-nav.shrunk .logo-circle { width: 26px; height: 26px; transition: all 0.3s ease; }
        .pill-nav.shrunk .logo-circle svg { width: 13px; height: 13px; }
        .pill-nav.shrunk .nav-center { gap: 16px; transition: all 0.3s ease; }
        .pill-nav.shrunk .nav-center button { font-size: 12.5px; }
        .pill-nav.shrunk .btn-login { padding: 5px 12px; font-size: 11.5px; transition: all 0.3s ease; }
        .logo-circle { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .nav-center { display: flex; gap: 32px; transition: all 0.3s ease; }
        .nav-center button { background: none; border: none; color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; transition: color 0.2s, transform 0.2s, font-size 0.3s; }
        .nav-center button:hover, .nav-center button.active { color: white; transform: translateY(-1px); }
        .btn-login { background: white; color: #0d1117; padding: 8px 20px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 600; transition: opacity 0.2s, padding 0.3s, font-size 0.3s; }
        .btn-login:hover { opacity: 0.9; }

        /* Playground Layout */
        .playground-view-container {
            padding-top: 100px;
            padding-bottom: 60px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            animation: playgroundPop 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes playgroundPop {
            0% { opacity: 0; transform: scale(0.92) translateY(30px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .playground-main-grid {
            display: flex;
            gap: 24px;
            width: 100%;
            max-width: 1100px;
            padding: 0 20px;
        }

        .visualizer-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        /* Integrated Terminal Styling */
        .command-terminal-wrapper {
            width: 100%;
            background: var(--bg-surface);
            border: 1px solid rgba(110, 86, 207, 0.3);
            border-radius: 14px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(110, 86, 207, 0.15);
            overflow: hidden;
        }

        .terminal-header {
            height: 36px;
            background: var(--bg-surface-elevated);
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            padding: 0 16px;
            position: relative;
        }

        .dots { display: flex; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ff5f56; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27c93f; }
        .terminal-title { position: absolute; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-secondary); }

        .terminal-inner {
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-family: 'JetBrains Mono', monospace;
        }

        .terminal-log {
            font-size: 13px;
            color: var(--text-secondary);
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 80px;
            overflow-y: auto;
        }

        .terminal-log-item { display: flex; gap: 8px; align-items: center; }

        .command-form {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .terminal-input-row {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #010409;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px 16px;
        }

        .prompt-symbol { color: var(--accent-blue); font-weight: bold; font-size: 16px; }

        .terminal-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #f0f6fc;
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
        }

        .command-actions {
            display: flex;
            justify-content: flex-end;
            gap: 12px;
        }

        /* Side Navigation & Info Box */
        .side-panel {
            width: 320px;
            background: var(--bg-surface);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .side-nav {
            display: flex;
            background: var(--bg-surface-elevated);
            border-bottom: 1px solid var(--border-color);
        }

        .side-nav button {
            flex: 1;
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 12px 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
        }

        .side-nav button:hover {
            color: #ffffff;
            background: rgba(255, 255, 255, 0.05);
        }

        .side-nav button.active {
            color: var(--accent-blue);
            background: rgba(88, 166, 255, 0.08);
        }

        .side-nav button.active::after {
            content: '';
            position: absolute;
            bottom: 0; left: 0; right: 0;
            height: 2px;
            background: var(--accent-blue);
        }

        .side-content {
            padding: 20px;
            font-size: 13px;
            flex: 1;
            overflow-y: auto;
        }

        .step-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .step-item {
            background: #010409;
            border: 1px solid var(--border-color);
            padding: 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
        }

        .step-item:hover {
            border-color: var(--accent-blue);
            transform: translateX(2px);
        }

        .step-code {
            color: var(--accent-blue);
            font-family: 'JetBrains Mono', monospace;
            font-weight: 600;
        }

        .step-desc {
            color: var(--text-secondary);
            font-size: 12px;
            margin-top: 2px;
        }

        /* Buttons */
        .glow-btn-purple {
            background: linear-gradient(135deg, #6e56cf 0%, #58a6ff 100%);
            color: #ffffff;
            border: none;
            padding: 8px 18px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 0 12px rgba(110, 86, 207, 0.5);
            transition: all 0.25s ease;
        }

        .glow-btn-purple:hover {
            transform: translateY(-2px);
            box-shadow: 0 0 20px rgba(110, 86, 207, 0.8);
            filter: brightness(1.1);
        }

        .glow-btn-outline {
            background: rgba(22, 27, 34, 0.8);
            color: #c9d1d9;
            border: 1px solid rgba(110, 86, 207, 0.5);
            padding: 8px 16px;
            font-size: 12px;
            font-weight: 600;
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.25s ease;
        }

        .glow-btn-outline:hover {
            border-color: #58a6ff;
            color: #ffffff;
            transform: translateY(-2px);
        }

        /* Landing Page Sections */
        .hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 180px 20px 80px; max-width: 900px; margin: 0 auto; }
        .badge { display: flex; align-items: center; gap: 8px; background: var(--bg-surface); border: 1px solid var(--border-color); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 32px; }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-blue); box-shadow: 0 0 12px var(--accent-blue); animation: pulse 2s infinite; }
        .pulse-dot.green { background: var(--accent-green); box-shadow: 0 0 12px var(--accent-green); }
        
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .hero-title { font-size: 64px; line-height: 1.1; letter-spacing: -0.04em; color: white; margin-bottom: 24px; }
        .hero-subtitle { font-size: 20px; color: whitesmoke; max-width: 600px; margin-bottom: 40px; }
        .btn-primary { background: linear-gradient(180deg, rgba(88, 166, 255, 0.15) 0%, rgba(88, 166, 255, 0) 100%), var(--bg-surface-elevated); border: 1px solid rgba(88, 166, 255, 0.4); color: white; padding: 12px 32px; font-size: 14px; font-weight: 600; border-radius: 100px; cursor: pointer; box-shadow: 0 0 20px rgba(88, 166, 255, 0.1); transition: all 0.2s; }
        .btn-primary:hover { border-color: var(--accent-blue); box-shadow: 0 0 30px rgba(88, 166, 255, 0.2); transform: translateY(-1px); }

        .terminal-mockup { margin-top: 60px; width: 100%; max-width: 700px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5); }
        .terminal-body { padding: 24px; font-family: 'JetBrains Mono', monospace; font-size: 13px; text-align: left; }
        .code-line { margin-bottom: 8px; }
        .code-line.indent { padding-left: 20px; }
        .code-line.dim { color: var(--text-secondary); }
        .accent { color: var(--accent-blue); }
        .path { color: var(--accent-green); }
        .cursor { animation: blink 1s step-end infinite; }
        
        @keyframes blink { 50% { opacity: 0; } }

        .bento-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; max-width: 1000px; margin: 0 auto 100px; padding: 0 20px; }
        .bento-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 20px; padding: 32px; position: relative; overflow: hidden; transition: border-color 0.3s; }
        .bento-card:hover { border-color: rgba(255, 255, 255, 0.2); }
        .terminal-card { grid-column: 1 / -1; display: flex; gap: 40px; align-items: center; }
        .card-icon { width: 48px; height: 48px; background: var(--bg-surface-elevated); border: 1px solid var(--border-color); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
        .bento-card h3 { font-size: 20px; color: white; margin-bottom: 12px; letter-spacing: -0.02em; }
        .bento-card p { color: var(--text-secondary); font-size: 15px; }
        .live-badge { position: absolute; top: 32px; right: 32px; display: flex; align-items: center; gap: 6px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--accent-green); border: 1px solid rgba(35, 134, 54, 0.3); padding: 4px 10px; border-radius: 100px; background: rgba(35, 134, 54, 0.1); }
        .terminal-snippet { background: #010409; padding: 24px; border-radius: 12px; border: 1px solid var(--border-color); font-family: 'JetBrains Mono', monospace; font-size: 13px; flex-grow: 1; }

        footer { text-align: center; padding: 60px 20px; border-top: 1px solid var(--border-color); }
        .btn-footer { background: none; border: none; color: whitesmoke; font-size: 16px; font-weight: 500; cursor: pointer; transition: color 0.2s; }
        .btn-footer:hover { color: white; }

        @media (max-width: 850px) {
            .playground-main-grid { flex-direction: column; }
            .side-panel { width: 100%; }
            .bento-grid { grid-template-columns: 1fr; }
            .terminal-card { flex-direction: column; align-items: flex-start; }
            .hero-title { font-size: 48px; }
            .nav-center { display: none; }
        }

        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .section-header { text-align: center; margin-bottom: 64px; }
        .section-header h2 { font-size: 32px; letter-spacing: -0.02em; margin-bottom: 8px; color: #f8f9fa; }

        .how-it-works { padding: 100px 20px; max-width: 800px; margin: 0 auto; }
        .timeline { position: relative; display: flex; flex-direction: column; gap: 48px; }
        .timeline-line { position: absolute; left: 50%; transform: translateX(-50%); top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, var(--border-color) 10%, var(--border-color) 90%, transparent); }
        .timeline-item { display: flex; align-items: center; width: 100%; position: relative; }
        .timeline-item.left { justify-content: flex-start; }
        .timeline-item.right { justify-content: flex-end; }
        .timeline-content { width: 45%; background: var(--bg-surface); border: 1px solid var(--border-color); padding: 24px; border-radius: 16px; }
        .step-title { font-size: 18px; margin-bottom: 8px; }
        .step-title.purple { color: var(--accent-purple); }
        .step-title.blue { color: var(--accent-blue); }
        .timeline-icon { position: absolute; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; background: var(--bg-base); border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 2; }
        .timeline-icon.purple-border { border: 1px solid rgba(137, 87, 229, 0.5); box-shadow: 0 0 15px rgba(137, 87, 229, 0.1); }
        .timeline-icon.blue-border { border: 1px solid rgba(88, 166, 255, 0.5); box-shadow: 0 0 15px rgba(88, 166, 255, 0.1); }

        .speed-precision { padding: 80px 20px; max-width: 1000px; margin: 0 auto; }
        .speed-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 24px; padding: 48px; display: flex; gap: 48px; align-items: center; }
        .speed-content { flex: 1; }
        .speed-content h2 { margin-bottom: 16px; font-size: 32px; letter-spacing: -0.02em; }
        .speed-content p { color: var(--text-secondary); margin-bottom: 24px; }
        .check-list { list-style: none; }
        .check-list li { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 14px; font-weight: 500; }
        .speed-code-block { flex: 1; background: #010409; padding: 32px; border-radius: 16px; border: 1px solid var(--border-color); font-family: 'JetBrains Mono', monospace; font-size: 13px; }
        .accent-blue { color: var(--accent-blue); font-weight: 600; }
        .cursor-block { animation: blink 1s step-end infinite; color: var(--accent-blue); }

        .faq { padding: 80px 20px; max-width: 700px; margin: 0 auto; }
        .faq-item { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 16px; overflow: hidden; }
        .faq-item summary { padding: 24px; font-size: 16px; font-weight: 500; cursor: pointer; list-style: none; display: flex; justify-content: space-between; align-items: center; }
        .faq-answer { padding: 0 24px 24px; color: var(--text-secondary); line-height: 1.6; }
        details[open] summary .arrow { transform: rotate(180deg); }
        .arrow { transition: transform 0.3s ease; color: var(--text-secondary); }

        .final-cta { text-align: center; padding: 100px 20px 40px; }
        .final-cta h2 { font-size: 40px; margin-bottom: 32px; letter-spacing: -0.02em; }
        .large-btn { padding: 16px 40px; font-size: 16px; }

        /* =========================================
   DYNAMIC LEARN PANEL
========================================= */

.learn-panel {
  animation: learnFadeIn 0.3s ease;
}

@keyframes learnFadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.learn-empty {
  text-align: center;
  padding: 35px 10px;
}

.learn-empty-icon {
  font-size: 32px;
  margin-bottom: 14px;
}

.learn-empty h4 {
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 8px;
}

.learn-empty p {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.learn-command-header {
  margin-bottom: 18px;
}

.learn-label {
  display: block;
  color: #8b949e;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  margin-bottom: 7px;
}

.learn-command {
  background: #010409;
  border: 1px solid rgba(88, 166, 255, 0.25);
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--accent-blue);
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  overflow-x: auto;
}

.learn-command code {
  color: #58a6ff;
  white-space: nowrap;
}

.learn-title {
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 8px;
}

.learn-description {
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
  margin-bottom: 22px;
}

.learn-section {
  margin-bottom: 22px;
}

.learn-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
}

.learn-bullets {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.learn-bullet {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  color: #b8c0cc;
  font-size: 11px;
  line-height: 1.5;
}

.bullet-number {
  min-width: 19px;
  height: 19px;
  border-radius: 50%;
  background: rgba(88, 166, 255, 0.12);
  border: 1px solid rgba(88, 166, 255, 0.3);
  color: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
}

.visual-flow {
  background: #010409;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 10px;
}

.visual-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 7px;
  background: rgba(255,255,255,0.025);
}

.visual-icon {
  width: 30px;
  height: 30px;
  border-radius: 7px;
  background: rgba(88, 166, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.visual-step-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.visual-step-content strong {
  color: #ffffff;
  font-size: 10px;
}

.visual-step-content span {
  color: var(--text-secondary);
  font-size: 9px;
  line-height: 1.4;
}

.visual-arrow {
  text-align: center;
  color: var(--accent-blue);
  font-size: 13px;
  height: 16px;
  line-height: 16px;
}

.learn-state {
  background: rgba(88, 166, 255, 0.04);
  border: 1px solid rgba(88, 166, 255, 0.15);
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 18px;
}

.state-title {
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
}

.state-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.state-item {
  background: #010409;
  border-radius: 7px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.state-item span {
  color: var(--text-secondary);
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.state-item strong {
  color: #ffffff;
  font-size: 10px;
}

.learn-result {
  display: flex;
  gap: 9px;
  padding: 11px;
  background: rgba(35, 134, 54, 0.08);
  border: 1px solid rgba(35, 134, 54, 0.25);
  border-radius: 9px;
}

.learn-result > span {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(35, 134, 54, 0.2);
  color: #3fb950;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
}

.learn-result strong {
  display: block;
  color: #ffffff;
  font-size: 10px;
  margin-bottom: 3px;
}

.learn-result p {
  color: #8b949e;
  font-size: 10px;
  line-height: 1.5;
}
      `}</style>

      {/* Background Blobs */}
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
      </div>

      {/* Global Navbar */}
      <header className={`navbar-wrapper ${isScrolled ? 'shrunk' : ''}`}>
        <nav className={`pill-nav ${isScrolled ? 'shrunk' : ''}`}>
          <div className="nav-left">
            <div className="logo-circle" onClick={() => setActiveTab('home')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="18" r="3"></circle>
                <circle cx="6" cy="6" r="3"></circle>
                <circle cx="18" cy="18" r="3"></circle>
                <line x1="6" y1="9" x2="6" y2="15"></line>
                <path d="M9 18h7a2 2 0 0 0 2-2V9"></path>
              </svg>
            </div>
          </div>
          
          <div className="nav-center">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'active' : ''}>Work</button>
            <button onClick={() => setActiveTab('home')}>About</button>
            <button onClick={() => setActiveTab('playground')} className={activeTab === 'playground' ? 'active' : ''}>Playground</button>
            <button onClick={() => setActiveTab('home')}>Resource</button>
          </div>

          <div className="nav-right">
            <a href="#" className="btn-login">Log In</a>
          </div>
        </nav>
      </header>

      {/* RENDER VIEW: PLAYGROUND OR HOME */}
      {activeTab === 'playground' ? (
        <div className="playground-view-container" key={playgroundKey}>
          {/* Interactive Shattered Cubes Playground Canvas */}
          <Playground />

          <div className="playground-main-grid">
            
            {/* Left Main Area: Visualizer + Integrated Terminal */}
            <div className="visualizer-section">
              <Play
                commandToExecute={activeCommand}
                onStateChange={setGitDashboardState}
              />

              {/* Integrated Git Terminal Input Bar */}
              <div className="command-terminal-wrapper">
                <div className="terminal-header">
                  <div className="dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="terminal-title">Interactive Git Terminal</div>
                </div>

                <div className="terminal-inner">
                  {/* Previous Output Log */}
                  {executedLogs.length > 0 && (
                    <div className="terminal-log">
                      {executedLogs.map((log, index) => (
                        <div className="terminal-log-item" key={index}>
                          <span className="prompt-symbol">➜</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleRunCommand} className="command-form">
                    <div className="terminal-input-row">
                      <span className="prompt-symbol">➜</span>
                      <input
                        type="text"
                        className="terminal-input"
                        placeholder="Type git command... (e.g. git commit -m 'feat: initial')"
                        value={commandInput}
                        onChange={(e) => setCommandInput(e.target.value)}
                      />
                    </div>

                    <div className="command-actions">
                      <button 
                        type="button" 
                        className="glow-btn-outline"
                        onClick={handleResetPlayground}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path>
                        </svg>
                        Reset
                      </button>

                      <button 
                        type="submit" 
                        className="glow-btn-purple"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                        Run
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Right Side Panel with 4-Tab Navigation */}
            <div className="side-panel">
              <div className="side-nav">
                <button 
                  className={sideTab === 'dashboard' ? 'active' : ''} 
                  onClick={() => setSideTab('dashboard')}
                >
                  Dashboard
                </button>
                <button 
                  className={sideTab === 'learn' ? 'active' : ''} 
                  onClick={() => setSideTab('learn')}
                >
                  Learn
                </button>
                <button 
                  className={sideTab === 'command' ? 'active' : ''} 
                  onClick={() => setSideTab('command')}
                >
                  Command
                </button>
                <button 
                  className={sideTab === 'about' ? 'active' : ''} 
                  onClick={() => setSideTab('about')}
                >
                  About
                </button>
              </div>

              <div className="side-content">
                {sideTab === 'dashboard' && (
                  <div className="dashboard-content">
                    <div className="dashboard-heading">
                      <div>
                        <h2>Git  Dashboard</h2>
                        <br />
                        <p>Live repository state</p>
                      </div>
                      <span className={`status-dot ${gitDashboardState.isInitialized ? 'online' : ''}`}></span>
                    </div>

                    <div className="dashboard-stats">
                      <div className="stat-card">
                        <span className="stat-icon">🌿</span>
                        <div><span className="stat-label">Branch</span>  <strong>main</strong></div>
                      </div>
                      <div className="stat-card">
                        <span className="stat-icon">📦</span>
                        <div><span className="stat-label">Commits</span>  <strong>{gitDashboardState.commits.length}</strong></div>
                      </div>
                      <div className="stat-card">
                        <span className="stat-icon">📝</span>
                        <div><span className="stat-label">Staging</span>  <strong>{gitDashboardState.hasStaged ? 'Ready' : 'Clean'}</strong></div>
                      </div>
                      <div className="stat-card">
                        <span className="stat-icon">🚀</span>
                        <div><span className="stat-label">Remote</span>  <strong>{gitDashboardState.commits.some((commit) => commit.pushed) ? 'Synced' : 'Local'}</strong></div>
                        <br />
                      </div>
                    </div>
                    <div className="git-flow">
                      <h2>Repository Flow</h2>
                      <br></br>

                      <div className="flow-step">
                        
                        <div><strong>1. Working Directory</strong>
                        <br />
                        <span>Your project files</span></div>
                      </div>
                      <div className="flow-line"></div>

                      <div className={`flow-step ${gitDashboardState.hasStaged ? 'active' : ''}`}>
                        <div><strong>2. Staging Area</strong>
                        <br />
                        <span>{gitDashboardState.hasStaged ? 'Changes staged' : 'Nothing staged'}</span></div>
                      </div>
                      <div className="flow-line"></div>

                      <div className={`flow-step ${gitDashboardState.commits.length > 0 ? 'active' : ''}`}>
                        <div><strong>3. Local Repository</strong>
                        <br />
                        <span>{gitDashboardState.commits.length} commit{gitDashboardState.commits.length !== 1 ? 's' : ''}</span></div>
                      </div>
                      <div className="flow-line"></div>
                      <div className={`flow-step ${gitDashboardState.commits.some((commit) => commit.pushed) ? 'active pushed' : ''}`}>
                        <div><strong>4. Remote</strong>
                        <br />
                        <span>{gitDashboardState.commits.some((commit) => commit.pushed) ? 'origin/main synced' : 'Not pushed'}</span></div>
                      </div>
                    </div>

                    <div className="recent-commits">
                      <div className="section-title">
                        <h5>Recent Commits</h5>

                        <span>{gitDashboardState.commits.length}</span>
                      </div>

                    </div>

                    <div className="repository-info">
                    
                      <div>
   
                      </div>
                    </div>
                  </div>
                )}
                {sideTab === 'learn' && (
  <div className="learn-panel">

    {!gitDashboardState.commandInfo?.command ? (

      <div className="learn-empty">

        <div className="learn-empty-icon">💡</div>

        <h4>Command Insights</h4>

        <p>
          Terminal mein koi Git command run karo.
          Yahan us command ka visual explanation dikhega.
        </p>

      </div>

    ) : (

      <div className="learn-content">

        {/* COMMAND HEADER */}

        <div className="learn-command-header">

          <span className="learn-label">
            EXECUTED COMMAND
          </span>

          <div className="learn-command">
            <span>➜</span>
            <code>
              {gitDashboardState.commandInfo.command}
            </code>
          </div>

        </div>


        {/* TITLE */}

        <h4 className="learn-title">

          {gitDashboardState.commandInfo.title}

        </h4>


        {/* SHORT DESCRIPTION */}

        <p className="learn-description">

          {gitDashboardState.commandInfo.shortDescription}

        </p>


        {/* WHAT HAPPENS */}

        <div className="learn-section">

          <div className="learn-section-title">
            <span>⚙️</span>
            What happens?
          </div>

          <div className="learn-bullets">

            {gitDashboardState.commandInfo.whatHappens?.map(
              (item, index) => (

                <div
                  className="learn-bullet"
                  key={index}
                >

                  <span className="bullet-number">
                    {index + 1}
                  </span>

                  <span>
                    {item}
                  </span>

                </div>

              )
            )}

          </div>

        </div>


        {/* VISUAL FLOW */}

        <div className="learn-section">

          <div className="learn-section-title">
            <span>🎯</span>
            Visual Flow
          </div>

          <div className="visual-flow">

            {gitDashboardState.commandInfo.visualization?.map(
              (step, index) => (

                <React.Fragment key={index}>

                  <div className="visual-step">

                    <div className="visual-icon">
                      {step.icon}
                    </div>

                    <div className="visual-step-content">

                      <strong>
                        {step.title}
                      </strong>

                      <span>
                        {step.text}
                      </span>

                    </div>

                  </div>

                  {index <
                    gitDashboardState.commandInfo.visualization.length - 1 && (

                    <div className="visual-arrow">
                      ↓
                    </div>

                  )}

                </React.Fragment>

              )
            )}

          </div>

        </div>


        {/* CURRENT STATE */}

        <div className="learn-state">

          <div className="state-title">
            📌 Current Git State
          </div>

          <div className="state-grid">

            <div className="state-item">

              <span>Repository</span>

              <strong>
                {gitDashboardState.isInitialized
                  ? "Initialized"
                  : "Not initialized"}
              </strong>

            </div>

            <div className="state-item">

              <span>Staging</span>

              <strong>
                {gitDashboardState.hasStaged
                  ? "Changes staged"
                  : "Clean"}
              </strong>

            </div>

            <div className="state-item">

              <span>Commits</span>

              <strong>
                {gitDashboardState.commits.length}
              </strong>

            </div>

            <div className="state-item">

              <span>Remote</span>

              <strong>
                {gitDashboardState.commits.some(
                  (commit) => commit.pushed
                )
                  ? "Synced"
                  : "Local"}
              </strong>

            </div>

          </div>

        </div>


        {/* RESULT */}

        <div className="learn-result">

          <span>✓</span>

          <div>

            <strong>
              What this means
            </strong>

            <p>
              {gitDashboardState.commandInfo.result}
            </p>

          </div>

        </div>

      </div>

    )}

  </div>
)}

                {sideTab === 'command' && (
                  <div>
                    <h4 style={{ color: '#fff', marginBottom: '12px' }}>Recommended Steps</h4>
                    <div className="step-list">
                      <div className="step-item" onClick={() => setCommandInput('git init')}>
                        <div className="step-code">git init</div>
                        <div className="step-desc">Initialize a new Git repository</div>
                      </div>
                      <div className="step-item" onClick={() => setCommandInput('git add .')}>
                        <div className="step-code">git add .</div>
                        <div className="step-desc">Stage all untracked changes</div>
                      </div>
                      <div className="step-item" onClick={() => setCommandInput('git commit -m "feat: setup"')}>
                        <div className="step-code">git commit -m "msg"</div>
                        <div className="step-desc">Save staged snapshot to history</div>
                      </div>
                      <div className="step-item" onClick={() => setCommandInput('git checkout -b feature')}>
                        <div className="step-code">git checkout -b feature</div>
                        <div className="step-desc">Create and switch to new branch</div>
                      </div>
                    </div>
                  </div>
                )}

                {sideTab === 'about' && (
                  <div>
                    <h4 style={{ color: '#fff', marginBottom: '8px' }}>Commit Canvas</h4>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      An interactive visual simulator for mastering Git workflows in real-time. Built to help developers build intuitive understanding of Git states.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* Home Landing Page */
        <main>
          <section className="hero">
            <div className="badge">
              <span className="pulse-dot"></span>
              COMMIT CANVAS
            </div>
            <h1 className="hero-title">Master Version<br />Control Visually.</h1>
            <p className="hero-subtitle">Commit Canvas brings Git workflows to life through interactive, real-time animations. Stop guessing your tree state.</p>
            
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setActiveTab('playground')}>
                Start Graphing
              </button>
            </div>

            <div className="terminal-mockup">
              <div className="terminal-header">
                <div className="dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="terminal-title">~/project/commit-canvas (main)</div>
              </div>
              <div className="terminal-body">
                <div className="code-line"><span className="accent">➜</span> <span className="path">commit-canvas</span> git commit -m "feat: bento grid"</div>
                <div className="code-line indent dim">[main 8f4a2b1] feat: bento grid</div>
                <div className="code-line indent dim">3 files changed, 142 insertions(+)</div>
                <div className="code-line"><span className="accent cursor">▋</span></div>
              </div>
            </div>
          </section>

          <section className="bento-grid">
            <div className="bento-card visual-branches">
              <div className="card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                  <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm-12 3a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3zm0 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3zm6-4.5c0-1.657 1.343-3 3-3h3m-9 6c0 1.657 1.343 3 3 3h3" />
                </svg>
              </div>
              <h3>Visual Branches</h3>
              <p>Understand complex merges instantly. The graph adapts in real-time, mapping your repository.</p>
            </div>

            <div className="bento-card real-time">
              <div className="card-icon outline">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#238636" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="live-badge"><span className="pulse-dot green"></span> LIVE</div>
              <h3>Real-time Tracking</h3>
              <p>Monitor your staging area and working directory simultaneously before you commit.</p>
            </div>

            <div className="bento-card terminal-card">
              <div className="card-content">
                <div className="card-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8957e5" strokeWidth="2">
                    <polyline points="4 17 10 11 4 5"></polyline>
                    <line x1="12" y1="19" x2="20" y2="19"></line>
                  </svg>
                </div>
                <h3>Interactive Terminal</h3>
                <p>Bridge the gap between CLI speed and GUI clarity. Type Git commands as normal, watch the visual graph react.</p>
              </div>
              <div className="terminal-snippet">
                <div className="code-line"><span className="accent">~</span> git checkout -b hotfix</div>
                <div className="code-line dim">Switched to a new branch 'hotfix'</div>
              </div>
            </div>
          </section>

          <section className="how-it-works reveal">
            <div className="section-header">
              <h2>How it Works</h2>
              <p>Three simple steps to visual mastery</p>
            </div>
            
            <div className="timeline">
              <div className="timeline-line"></div>
              
              <div className="timeline-item left">
                <div className="timeline-content">
                  <h4 className="step-title purple">01. Install CLI</h4>
                  <p>Download the Commit Canvas binary and alias it to your git commands in seconds.</p>
                </div>
                <div className="timeline-icon purple-border">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8957e5" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </div>
              </div>

              <div className="timeline-item right">
                <div className="timeline-icon blue-border">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"></path>
                  </svg>
                </div>
                <div className="timeline-content">
                  <h4 className="step-title blue">02. Auto-Sync</h4>
                  <p>The background daemon watches your .git directory for changes in real-time.</p>
                </div>
              </div>

              <div className="timeline-item left">
                <div className="timeline-content">
                  <h4 className="step-title purple">03. Visual Feedback</h4>
                  <p>Open the Canvas dashboard to see your branch topology update as you type.</p>
                </div>
                <div className="timeline-icon purple-border">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8957e5" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section className="speed-precision reveal">
            <div className="speed-card">
              <div className="speed-content">
                <h2>Designed for Speed & Precision</h2>
                <p>Commit Canvas doesn't just look pretty. It's built to help you avoid merge conflicts and understand rebases before they happen. Minimal overhead, maximum context.</p>
                <ul className="check-list">
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Zero-latency local graph rendering
                  </li>
                  <li>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#58a6ff" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Native Vim-style keybindings
                  </li>
                </ul>
              </div>
              <div className="speed-code-block">
                <div className="code-line dim">// Interactive rebase</div>
                <div className="code-line"><span className="accent">git</span> rebase -i HEAD~3</div>
                <br />
                <div className="code-line"><span className="accent-blue">PICK</span> 8f4a2b1 feat: landing page</div>
                <div className="code-line"><span className="accent-blue">SQUASH</span> a9c34d2 docs: update README</div>
                <div className="code-line"><span className="accent-blue">EDIT</span> 5e2d1f0 fix: typo</div>
                <br />
                <div className="code-line cursor-block">_</div>
              </div>
            </div>
          </section>

          <section className="faq reveal">
            <div className="section-header">
              <h2>Common Questions</h2>
            </div>
            <div className="faq-container">
              <details className="faq-item">
                <summary>Does it work with GitHub?<span className="arrow">↓</span></summary>
                <div className="faq-answer">Yes! Commit Canvas works with any Git repository locally, regardless of where the remote is hosted.</div>
              </details>
              <details className="faq-item">
                <summary>Is it free for open source?<span className="arrow">↓</span></summary>
                <div className="faq-answer">Absolutely. The visualization engine is completely free for public repositories.</div>
              </details>
              <details className="faq-item">
                <summary>Does it support Windows?<span className="arrow">↓</span></summary>
                <div className="faq-answer">We support macOS, Linux, and Windows natively.</div>
              </details>
            </div>
          </section>

          <section className="final-cta reveal">
            <h2>Ready to start graphing?</h2>
            <button className="btn-primary large-btn" onClick={() => setActiveTab('playground')}>
              Launch Workspace
            </button>
          </section>
        </main>
      )}

      {/* Global Footer */}
      <footer>
        <button className="btn-footer" onClick={() => setActiveTab('playground')}>
          Go to Playground →
        </button>
      </footer>
    </>
  );
}
