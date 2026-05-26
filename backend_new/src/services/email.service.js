import sgMail from "@sendgrid/mail";
import { ApiError } from "../utils/ApiError.js";

/**
 * Send a generic email using SendGrid HTTP API
 */
export const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.SMTP_PASS;
  const isConfigured = apiKey && !apiKey.includes("your_actual_api_key_here") && !apiKey.includes("your_app_password");

  if (isConfigured) {
    sgMail.setApiKey(apiKey);
  }

  console.log(`📡 Preparing email for ${to}...`);
  
  if (!isConfigured) {
    console.log(`\n📧 [DEV MODE] Email Intercepted (To: ${to})`);
    console.log(`📝 Subject: ${subject}`);
    const urlMatch = html.match(/href="([^"]+)"/);
    if (urlMatch) console.log(`🔗 LINK: ${urlMatch[1]}\n`);
    return true;
  }

  const msg = {
    to,
    from: process.env.EMAIL_FROM || "ISO Audit System <rajendra.22211624@viit.ac.in>",
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`📧 Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("❌ SendGrid Error:");
    if (error.response) {
      console.error(error.response.body);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

/**
 * Template for Password Reset Email
 */
export const sendPasswordResetEmail = async (user, resetUrl) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f7f9; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">ISO Audit System</h1>
      </div>
      <h2 style="font-size: 20px; color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="font-size: 16px; line-height: 1.6;">Hello <strong>${user.name}</strong>,</p>
      <p style="font-size: 16px; line-height: 1.6;">
        We received a request to reset your password. Click the button below.
        This link is valid for <strong>15 minutes</strong>.
      </p>
      <div style="text-align: center; margin: 35px 0;">
        <a href="${resetUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
          Reset My Password
        </a>
      </div>
      <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
        If you didn't request this, you can safely ignore this email.
      </p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
      <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
        © 2026 ISO Audit Management System | Engineering College
      </p>
    </div>
  </body>
  </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: "Password Reset - ISO Audit System",
    html,
  });
};

