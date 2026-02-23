// region imports
import nodemailer from "nodemailer";
import { env } from "../config/envConfig.js";
// endregion

// region transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env?.EMAIL_USER,
    pass: env?.EMAIL_PASS,
  },
});
// endregion

// region send email
export const sendWelcomeEmail = async ({ Email, Name }) => {
  try {
    await transporter.verify();
    console.log("SMTP server is ready");

    await transporter.sendMail({
      from: `"Issue Tracker Team" <${env.EMAIL_USER}>`,
      to: Email,
      subject: "Welcome to Issue Tracker",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f4f6f8; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
            
            <!-- Header -->
            <div style="background:#2563eb; color:#ffffff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Welcome to Issue Tracker</h1>
            </div>

            <!-- Body -->
            <div style="padding:30px; color:#111827;">
              <h2 style="margin-top:0;">Hello ${Name},</h2>
              
              <p style="line-height:1.6;">
                Your account has been created successfully. You can now start tracking,
                managing, and resolving issues efficiently using our platform.
              </p>

              <p style="line-height:1.6;">
                If you have any questions or need assistance, feel free to reach out to our support team.
              </p>

              <!-- CTA Button -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${env.APP_URL || "#"}"
                   style="background:#2563eb; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:6px; font-weight:bold; display:inline-block;">
                  Go to Dashboard
                </a>
              </div>

              <p style="line-height:1.6;">
                We’re glad to have you on board.
              </p>

              <p style="margin-top:30px;">
                — <strong>The Issue Tracker Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#6b7280;">
              <p style="margin:0;">
                This is an automated message. Please do not reply to this email.
              </p>
            </div>

          </div>
        </div>
      `,
    });

    console.log("Welcome email sent to:", Email);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
};
// endregion

// region send verification email
export const sendVerificationEmail = async ({ Email, Name, token }) => {
  const verifyUrl = `http://localhost:5000/api/users/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Issue Tracker Team" <${env.EMAIL_USER}>`,
    to: Email,
    subject: "Verify your email address",
    html: `
      <h2>Hello ${Name},</h2>
      <p>Please verify your email address by clicking the button below.</p>

      <a href="${verifyUrl}"
         style="background:#2563eb;color:#fff;padding:10px 18px;
                text-decoration:none;border-radius:6px;display:inline-block;">
        Verify Email
      </a>

      <p>This link will expire in 15 minutes.</p>
    `,
  });
};
// endregion

// region reset password
export const sendPasswordResetEmail = async ({ Email, Name, token }) => {
  const resetUrl = `${env.APP_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Issue Tracker Team" <${env.EMAIL_USER}>`,
    to: Email,
    subject: "Reset your password",
    html: `
      <h2>Hello ${Name},</h2>
      <p>You requested to reset your password.</p>

      <a href="${resetUrl}"
         style="background:#dc2626;color:#fff;padding:10px 18px;
                text-decoration:none;border-radius:6px;display:inline-block;">
        Reset Password
      </a>

      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  });
};
// endregion