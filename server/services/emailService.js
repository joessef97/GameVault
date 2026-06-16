import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email, resetUrl) => {
const isSmtpConfigured = () => (
  Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS)
);

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const buildResetEmail = (to, resetUrl) => ({
  from: process.env.SMTP_FROM || `"GameVault" <no-reply@gamevault.com>`,
  to,
  subject: 'GameVault - Password Reset Request',
  text: `You requested a password reset. Visit the link to set a new password: ${resetUrl}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; padding: 24px; background:#0f1724; color:#e6eef8; border-radius:8px;">
      <h2 style="color:#8b5cf6; text-align:center;">GameVault Password Reset</h2>
      <p style="color:#cbd5e1;">We received a request to reset the password for your account. Click the button below to proceed.</p>
      <div style="text-align:center; margin:28px 0;">
        <a href="${resetUrl}" style="background-color:#7c3aed;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;font-weight:600;">Reset Password</a>
      </div>
      <p style="color:#94a3b8; font-size:13px;">If the button doesn't work, copy and paste the following URL into your browser:</p>
      <p style="word-break:break-all;color:#7c3aed">${resetUrl}</p>
      <hr style="border:0;border-top:1px solid rgba(255,255,255,0.04);margin:18px 0;" />
      <p style="color:#60738a;font-size:12px;">If you did not request this, please ignore this email. This link expires in 1 hour.</p>
    </div>
  `
});

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'https://my-domain.com';
    const resetUrl = `${clientUrl.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(resetToken)}`;

    const mailOptions = buildResetEmail(email, resetUrl);

    if (!isSmtpConfigured()) {
      console.warn('SMTP not configured; printing reset URL to console for debugging.');
      console.log(`Password reset (debug) -> To: ${email} URL: ${resetUrl}`);
      return { debug: true, resetUrl };
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.info(`Password reset email queued. to=${email} messageId=${info.messageId}`);
    console.debug(`Password reset URL (debug): ${resetUrl}`);
    return { info, resetUrl };
  } catch (err) {
    console.error('Failed to send password reset email:', err);
    throw err;
  }
};

export const sendTestEmail = async (to) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || `"GameVault" <no-reply@gamevault.com>`,
      to,
      subject: 'GameVault - SMTP Test',
      text: 'This is a test email to verify SMTP configuration for GameVault.',
      html: `<p>This is a test email to verify SMTP configuration for <strong>GameVault</strong>.</p>`
    };

    if (!isSmtpConfigured()) {
      console.warn('SMTP not configured; test email will not be sent.');
      return { debug: true };
    }

    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.info(`Test email sent. to=${to} messageId=${info.messageId}`);
    return { info };
  } catch (err) {
    console.error('Failed to send test email:', err);
    throw err;
  }
};
};
