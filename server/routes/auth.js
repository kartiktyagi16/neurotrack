const express = require('express')
const router = express.Router()

// In-memory OTP store: { email: { otp, expiresAt } }
const otpStore = new Map()

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * POST /api/auth/send-otp
 * Body: { email: string, name: string }
 * Generates OTP and sends via email (nodemailer) or returns it in demo mode
 */
router.post('/send-otp', async (req, res) => {
  const { email, name } = req.body
  if (!email) return res.status(400).json({ error: 'email is required' })

  const otp = generateOTP()
  const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

  // Store OTP
  otpStore.set(email.toLowerCase(), { otp, expiresAt })

  // Try to send via nodemailer if env vars are set
  const SMTP_HOST = process.env.SMTP_HOST
  const SMTP_USER = process.env.SMTP_USER
  const SMTP_PASS = process.env.SMTP_PASS
  const SMTP_PORT = process.env.SMTP_PORT || 587

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    try {
      const nodemailer = require('nodemailer')
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: SMTP_PORT == 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })

      await transporter.sendMail({
        from: `"NeuroTrack" <${SMTP_USER}>`,
        to: email,
        subject: `Your NeuroTrack OTP: ${otp}`,
        html: `
          <div style="font-family: 'DM Sans', sans-serif; max-width: 520px; margin: 0 auto; background: #111214; color: #f0f1f3; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #1a2a3a, #1a1a2a); padding: 32px 36px 24px;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:24px;">
                <div style="width:8px;height:8px;background:#3ea6ff;border-radius:50%;box-shadow:0 0 8px #3ea6ff;"></div>
                <span style="font-size:18px;font-weight:800;letter-spacing:-0.3px;">NeuroTrack</span>
              </div>
              <h1 style="font-size:24px;font-weight:800;margin:0 0 8px;">Your verification code</h1>
              <p style="color:#9ba3af;font-size:14px;margin:0;">Hi ${name || 'there'}, use the code below to verify your login.</p>
            </div>
            <div style="padding: 32px 36px;">
              <div style="background:#202228;border:1px solid #2c2f38;border-radius:12px;padding:28px;text-align:center;margin-bottom:24px;">
                <div style="font-size:40px;font-weight:900;letter-spacing:8px;color:#3ea6ff;font-family:monospace;">${otp}</div>
                <p style="color:#5c6475;font-size:12px;margin-top:10px;">Expires in 10 minutes</p>
              </div>
              <p style="color:#5c6475;font-size:12px;line-height:1.6;">
                If you didn't request this code, you can safely ignore this email.<br/>
                Never share your OTP with anyone.
              </p>
            </div>
            <div style="border-top:1px solid #2c2f38;padding:16px 36px;text-align:center;">
              <p style="color:#5c6475;font-size:11px;margin:0;">© 2026 NeuroTrack · Track. Learn. Evolve.</p>
            </div>
          </div>
        `,
      })

      console.log(`[Auth] OTP sent to ${email}`)
      return res.json({ success: true, message: `OTP sent to ${email}`, demo: false })
    } catch (err) {
      console.error('[Auth] Email send failed:', err.message)
      // Fall through to demo mode
    }
  }

  // Demo mode — return OTP in response (for development without SMTP)
  console.log(`[Auth] DEMO MODE — OTP for ${email}: ${otp}`)
  return res.json({ success: true, otp, message: 'Demo mode: OTP returned in response', demo: true })
})

/**
 * POST /api/auth/verify-otp
 * Body: { email: string, otp: string }
 */
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) return res.status(400).json({ error: 'email and otp are required' })

  const record = otpStore.get(email.toLowerCase())
  if (!record) return res.status(400).json({ error: 'No OTP found for this email. Please request a new one.' })
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase())
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' })
  }
  if (record.otp !== otp) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' })
  }

  // OTP valid — clear it
  otpStore.delete(email.toLowerCase())
  console.log(`[Auth] OTP verified for ${email}`)
  return res.json({ success: true, message: 'OTP verified successfully' })
})

module.exports = router
