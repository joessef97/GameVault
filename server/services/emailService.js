import nodemailer from 'nodemailer';

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const isSmtpConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  const mailOptions = {
    from: process.env.FROM_EMAIL || '"GameVault" <no-reply@gamevault.com>',
    to: email,
    subject: 'GameVault - Password Reset Request',
    text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n` +
          `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
          `${resetUrl}\n\n` +
          `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 5px;">
        <h2 style="color: #6d28d9; text-align: center;">GameVault Password Reset</h2>
        <p>You requested to reset your password. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6d28d9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, copy and paste the following URL into your browser:</p>
        <p style="word-break: break-all; color: #6d28d9;">${resetUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">If you did not request this reset, please ignore this email. This link will expire in 1 hour.</p>
      </div>
    `
  };

  if (isSmtpConfigured) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to: ${email}`);
  } else {
    console.log('--- SMTP Not Configured. Email output below ---');
    console.log(`To: ${email}`);
    console.log(`Subject: ${mailOptions.subject}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('------------------------------------------------');
  }
};
