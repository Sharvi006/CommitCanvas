
import { useState } from 'react'
import './Login.css'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message || 'Could not send OTP')
        return
      }

      setStep(2)
      setMessage('OTP sent! Check your email.')
    } catch {
      setMessage('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message || 'OTP verification failed')
        return
      }

      setStep(3)
      setMessage('Your email has been verified!')
    } catch {
      setMessage('Cannot connect to server.')
    } finally {
      setLoading(false)
    }
  }

  function goBack() {
    setStep(1)
    setOtp('')
    setMessage('')
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <header className="brand">
          <div className="logo">CC</div>
          <div>
            <h2>CommitCanvas</h2>
            <p>GIT LEARNING PLATFORM</p>
          </div>
        </header>

        <div className="login-content">
          <div className="progress">
            {['Login', 'OTP', 'Verified'].map((label, index) => (
              <div
                className={`progress-step ${
                  step >= index + 1 ? 'active' : ''
                }`}
                key={label}
              >
                <span className="progress-number">
                  {step > index + 1 ? '✓' : index + 1}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <p className="eyebrow">YOUR GIT JOURNEY STARTS HERE</p>
              <h1>Welcome Back!</h1>
              <p className="subtitle">
                Login to continue your Git journey.
              </p>

              <form onSubmit={handleLogin}>
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
                  required
                />

                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  className="text-button forgot-button"
                  type="button"
                  onClick={() =>
                    setMessage('Password recovery is not connected yet.')
                  }
                >
                  Forgot Password?
                </button>

                <button
                  className="main-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Login & Send OTP →'}
                </button>
              </form>

              <p className="terms">
                By continuing, you agree to use CommitCanvas responsibly.
              </p>
            </>
          )}

          {step === 2 && (
            <>
              <div className="step-icon">✉</div>
              <p className="eyebrow">ONE LAST STEP</p>
              <h1>Check your email</h1>
              <p className="subtitle">
                We've sent a 6-digit verification code to
                <strong className="email-address"> {email}</strong>
              </p>

              <form onSubmit={handleVerify}>
                <label htmlFor="otp">Verification code</label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ''))
                  }
                  autoComplete="one-time-code"
                  required
                />

                <button
                  className="main-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue →'}
                </button>

                <button
                  className="text-button back-button"
                  type="button"
                  onClick={goBack}
                >
                  ← Back to Login
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <div className="success-panel">
              <div className="success-icon">✓</div>
              <p className="eyebrow">VERIFICATION COMPLETE</p>
              <h1>You're Verified!</h1>
              <p className="subtitle">
                Your email has been verified successfully.
              </p>
              <p className="verified-email">{email}</p>

              <button
                className="main-button"
                type="button"
                onClick={() => onLoginSuccess(email)}
              >
                Confirm & Continue →
              </button>
            </div>
          )}

          {message && (
            <p
              className={`message ${
                message.toLowerCase().includes('cannot connect') ||
                message.toLowerCase().includes('failed') ||
                message.toLowerCase().includes('not connected') ||
                message.toLowerCase().includes('could not') ||
                message.toLowerCase().includes('resend') ||
                message.toLowerCase().includes('testing emails') ||
                message.toLowerCase().includes('verify a domain')
                  ? 'error-message'
                  : ''
              }`}
              role="status"
            >
              {message}
            </p>
          )}
        </div>

        <footer className="login-footer">
          <span>© 2026 CommitCanvas</span>
          <span>Learn · Practice · Grow</span>
        </footer>
      </section>

      <aside className="visual-panel">
        <div className="visual-glow glow-one" />
        <div className="visual-glow glow-two" />

        <div className="visual-top">
          <span className="visual-brand-mark">CC</span>
          <span className="visual-label">BUILD YOUR GIT SKILLS</span>
        </div>

        <div className="visual-content">
          <p className="visual-kicker">CODE. COMMIT. CREATE.</p>
          <h2>
            Your ideas.
            <br />
            Your code.
            <br />
            <span>Your canvas.</span>
          </h2>

          <p className="visual-description">
            Learn Git step by step, practise your workflow,
            and turn every commit into progress.
          </p>

          <div className="code-card">
            <div className="code-card-header">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>
              <span>terminal — commitcanvas</span>
            </div>

            <div className="code-lines">
              <p><span className="code-purple">$</span> git init</p>
              <p><span className="code-purple">$</span> git add .</p>
              <p><span className="code-purple">$</span> git commit -m</p>
              <p className="code-success">✓ Your journey starts here_</p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-icon">⌘</div>
            <div>
              <strong>Learn by doing</strong>
              <p>Small steps. Real progress.</p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-icon">⑂</div>
            <div>
              <strong>Master your workflow</strong>
              <p>Branches, commits and collaboration.</p>
            </div>
          </div>
        </div>

        <div className="visual-footer">
          <span>LEARN</span>
          <span className="footer-dot">•</span>
          <span>PRACTICE</span>
          <span className="footer-dot">•</span>
          <span>GROW</span>
        </div>
      </aside>
    </main>
  )
}
