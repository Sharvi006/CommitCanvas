import React, { useEffect } from 'react';

export default function CommitCanvas() {
  // This hook handles the scrollytelling animations exactly like your vanilla JS did[cite: 2]
  useEffect(() => {
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

    // Cleanup observer on unmount
    return () => {
      elements.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <>
      {/* Injecting your exact CSS to ensure 0 changes to UI/UX[cite: 3] */}
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

        .navbar-wrapper { position: fixed; top: 24px; left: 0; right: 0; display: flex; justify-content: center; z-index: 100; }
        .pill-nav { display: flex; align-items: center; justify-content: space-between; width: 100%; max-width: 800px; height: 56px; background: rgba(22, 27, 34, 0.6); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid var(--border-color); border-radius: 100px; padding: 0 12px; box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4); }
        .logo-circle { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .nav-center { display: flex; gap: 32px; }
        .nav-center a { color: var(--text-secondary); text-decoration: none; font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-center a:hover { color: white; }
        .btn-login { background: white; color: #0d1117; padding: 8px 20px; border-radius: 100px; text-decoration: none; font-size: 14px; font-weight: 600; transition: opacity 0.2s; }
        .btn-login:hover { opacity: 0.9; }

        .hero { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 180px 20px 80px; max-width: 900px; margin: 0 auto; }
        .badge { display: flex; align-items: center; gap: 8px; background: var(--bg-surface); border: 1px solid var(--border-color); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 32px; }
        .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent-blue); box-shadow: 0 0 12px var(--accent-blue); animation: pulse 2s infinite; }
        .pulse-dot.green { background: var(--accent-green); box-shadow: 0 0 12px var(--accent-green); }
        
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

        .hero-title { font-size: 64px; line-height: 1.1; letter-spacing: -0.04em; color: white; margin-bottom: 24px; }
        .hero-subtitle { font-size: 20px; color: whitesmoke; max-width: 600px; margin-bottom: 40px; }
        .btn-primary { background: linear-gradient(180deg, rgba(88, 166, 255, 0.15) 0%, rgba(88, 166, 255, 0) 100%), var(--bg-surface-elevated); border: 1px solid rgba(88, 166, 255, 0.4); color: grey; padding: 12px 32px; font-size: 14px; font-weight: 600; border-radius: 100px; cursor: pointer; box-shadow: 0 0 20px rgba(88, 166, 255, 0.1); transition: all 0.2s; }
        .btn-primary:hover { border-color: var(--accent-blue); box-shadow: 0 0 30px rgba(88, 166, 255, 0.2); transform: translateY(-1px); }

        .terminal-mockup { margin-top: 60px; width: 100%; max-width: 700px; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5); }
        .terminal-header { height: 36px; background: var(--bg-surface-elevated); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; padding: 0 16px; position: relative; }
        .dots { display: flex; gap: 6px; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot.red { background: #ff5f56; }
        .dot.yellow { background: #ffbd2e; }
        .dot.green { background: #27c93f; }
        .terminal-title { position: absolute; left: 50%; transform: translateX(-50%); font-family: 'JetBrains Mono', monospace; font-size: 11px; color: var(--text-secondary); }
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
        .btn-footer { color: whitesmoke; text-decoration: none; font-size: 16px; font-weight: 500; transition: color 0.2s; }
        .btn-footer:hover { color: white; }

        @media (max-width: 768px) {
            .bento-grid { grid-template-columns: 1fr; }
            .terminal-card { flex-direction: column; align-items: flex-start; }
            .hero-title { font-size: 48px; }
            .nav-center { display: none; }
        }

        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }
        .section-header { text-align: center; margin-bottom: 64px; }
        .section-header h2 { font-size: 32px; letter-spacing: -0.02em; margin-bottom: 8px; color: #f8f9fa; }
        .section-header p { color: whitesmoke; }

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
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-answer { padding: 0 24px 24px; color: var(--text-secondary); line-height: 1.6; }
        details[open] summary .arrow { transform: rotate(180deg); }
        .arrow { transition: transform 0.3s ease; color: var(--text-secondary); }

        .final-cta { text-align: center; padding: 100px 20px 40px; }
        .final-cta h2 { font-size: 40px; margin-bottom: 32px; letter-spacing: -0.02em; }
        .large-btn { padding: 16px 40px; font-size: 16px; }

        @media (max-width: 768px) {
            .timeline-line { left: 20px; }
            .timeline-item.left, .timeline-item.right { justify-content: flex-end; }
            .timeline-content { width: calc(100% - 60px); }
            .timeline-icon { left: 20px; }
            .speed-card { flex-direction: column; padding: 32px; }
        }
      `}</style>

      {/* Your exact HTML mapped to JSX[cite: 1] */}
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
      </div>

      <header className="navbar-wrapper">
        <nav className="pill-nav">
          <div className="nav-left">
            <div className="logo-circle">
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
            <a href="#">Work</a>
            <a href="#">About</a>
            <a href="#">Playground</a>
            <a href="#">Resource</a>
          </div>
          <div className="nav-right">
            <a href="#" className="btn-login">Log In</a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="badge">
            <span className="pulse-dot"></span>
            COMMIT CANVAS
          </div>
          <h1 className="hero-title">Master Version<br />Control Visually.</h1>
          <p className="hero-subtitle">Commit Canvas brings Git workflows to life through interactive, real-time animations. Stop guessing your tree state.</p>
          
          <div className="hero-actions">
            <button className="btn-primary">Start Graphing</button>
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
                <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm-12 3a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm0 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3zm6-4.5c0-1.657 1.343-3 3-3h3m-9 6c0 1.657 1.343 3 3 3h3" />
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
          <button className="btn-primary large-btn">Launch Workspace</button>
        </section>
      </main>

      <footer>
        <a href="#" className="btn-footer">Go to Playground →</a>
      </footer>
    </>
  );
}