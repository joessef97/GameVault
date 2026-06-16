import nodemailer from 'nodemailer';

const DEFAULT_CLIENT_URL = 'https://game-vault-murex.vercel.app';

const getClientUrl = () => (process.env.CLIENT_URL || DEFAULT_CLIENT_URL).replace(/\/$/, '');

const isSmtpConfigured = () => (
  Boolean(
    process.env.SMTP_HOST
    && process.env.SMTP_PORT
    && process.env.SMTP_USER
    && process.env.SMTP_PASS
    && process.env.SMTP_FROM
  )
);

const createTransporter = () => {
  const port = parseInt(process.env.SMTP_PORT, 10);

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const buildResetEmail = (to, resetUrl) => {
  const plainText = [
    'Game Vault - Password Reset',
    '',
    'We received a request to reset the password for your Game Vault account.',
    'Use the link below to choose a new password. This link expires in 1 hour.',
    '',
    resetUrl,
    '',
    'If you did not request a password reset, you can safely ignore this email.'
  ].join('\n');

  return {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Game Vault - Reset Your Password',
    text: plainText,
    html: `
      <!DOCTYPE html>
      <html lang="en">
        <body style="margin:0;padding:0;background-color:#0b1020;font-family:Arial,Helvetica,sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0b1020;padding:32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#12182b;border:1px solid #2a2a3e;border-radius:12px;overflow:hidden;">
                  <tr>
                    <td style="padding:28px 32px 16px;text-align:center;background:linear-gradient(135deg,#1a1033 0%,#12182b 100%);">
                      <div style="display:inline-block;width:52px;height:52px;line-height:52px;border-radius:14px;background-color:rgba(124,58,237,0.18);color:#a78bfa;font-size:24px;font-weight:700;">GV</div>
                      <h1 style="margin:16px 0 8px;color:#ffffff;font-size:24px;font-weight:700;">Game Vault</h1>
                      <p style="margin:0;color:#94a3b8;font-size:14px;">Password reset request</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:28px 32px;color:#e2e8f0;font-size:15px;line-height:1.6;">
                      <p style="margin:0 0 16px;">Hello,</p>
                      <p style="margin:0 0 16px;">We received a request to reset the password for your Game Vault account. Click the button below to choose a new password.</p>
                      <p style="margin:0 0 24px;color:#fbbf24;font-size:14px;">This link expires in <strong>1 hour</strong> for your security.</p>
                      <div style="text-align:center;margin:0 0 28px;">
                        <a href="${resetUrl}" style="display:inline-block;background-color:#7c3aed;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:8px;">Reset Password</a>
                      </div>
                      <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">If the button does not work, copy and paste this link into your browser:</p>
                      <p style="margin:0;word-break:break-all;color:#a78bfa;font-size:13px;">${resetUrl}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:20px 32px 28px;border-top:1px solid rgba(255,255,255,0.06);color:#64748b;font-size:12px;line-height:1.5;">
                      If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };
};

const logSmtpError = (context, err) => {
  console.error(`[SMTP] ${context} failed`, {
    code: err.code,
    response: err.response,
    responseCode: err.responseCode,
    command: err.command,
    message: err.message
  });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  if (!isSmtpConfigured()) {
    const error = new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.');
    logSmtpError('password reset email', error);
    throw error;
  }

  const resetUrl = `${getClientUrl()}/reset-password?token=${encodeURIComponent(resetToken)}`;
  const mailOptions = buildResetEmail(email, resetUrl);

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.info(`[SMTP] Password reset email sent to=${email} messageId=${info.messageId}`);
    return { messageId: info.messageId };
  } catch (err) {
    logSmtpError('password reset email', err);
    throw err;
  }
};

export const sendTestEmail = async (to) => {
  if (!isSmtpConfigured()) {
    const error = new Error('SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.');
    logSmtpError('test email', error);
    throw error;
  }

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: 'Game Vault - SMTP Test',
    text: 'This is a test email to verify SMTP configuration for Game Vault.',
    html: `<p>This is a test email to verify SMTP configuration for <strong>Game Vault</strong>.</p>`
  };

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.info(`[SMTP] Test email sent to=${to} messageId=${info.messageId}`);
    return { messageId: info.messageId };
  } catch (err) {
    logSmtpError('test email', err);
    throw err;
  }
};
