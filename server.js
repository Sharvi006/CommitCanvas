import crypto from 'node:crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import { Resend } from 'resend';
import { fileURLToPath } from 'node:url';

const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(serverDirectory, '.env') });

const app = express();
const port = Number(process.env.PORT) || 5000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());

const otpStore = new Map();
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

app.get('/', (_req, res) => {
  res.send('CommitCanvas Backend is Running!');
});

app.post('/send-otp', async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  if (!resend) {
    return res.status(503).json({
      message: 'Email delivery is not configured. Add RESEND_API_KEY to .env.',
    });
  }

  const otp = crypto.randomInt(100000, 1000000).toString();

  try {
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'CommitCanvas <onboarding@resend.dev>',
      to: [email],
      subject: 'Your CommitCanvas OTP',
      html: `
        <h2>CommitCanvas Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This code expires in 5 minutes. Do not share it with anyone.</p>
      `,
    });

    if (result.error) {
      console.error('Email sending failed:', result.error);
      const resendMessage = typeof result.error.message === 'string'
        ? result.error.message
        : null;
      return res.status(500).json({
        message: process.env.NODE_ENV === 'production'
          ? 'Email could not be sent. Check your Resend setup.'
          : resendMessage || 'Email could not be sent. Check your Resend setup.',
      });
    }

    otpStore.set(email.toLowerCase(), {
      otp,
      expiresAt: Date.now() + OTP_TTL_MS,
      attempts: 0,
    });

    return res.json({ message: 'OTP sent successfully!' });
  } catch (error) {
    console.error('Send OTP error:', error.message);
    return res.status(500).json({ message: 'Failed to send OTP.' });
  }
});

app.post('/verify-otp', (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
  const otp = typeof req.body?.otp === 'string' ? req.body.otp.trim() : '';

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }

  const key = email.toLowerCase();
  const saved = otpStore.get(key);

  if (!saved || Date.now() > saved.expiresAt) {
    otpStore.delete(key);
    return res.status(400).json({
      message: 'OTP expired or not found. Please request a new one.',
    });
  }

  if (saved.attempts >= MAX_OTP_ATTEMPTS) {
    otpStore.delete(key);
    return res.status(429).json({
      message: 'Too many attempts. Please request a new OTP.',
    });
  }

  saved.attempts += 1;

  if (saved.otp !== otp) {
    return res.status(400).json({ message: 'Incorrect OTP. Try again.' });
  }

  otpStore.delete(key);
  return res.json({ message: 'OTP verified successfully!' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Resend API key configured: ${Boolean(process.env.RESEND_API_KEY)}`);
});
