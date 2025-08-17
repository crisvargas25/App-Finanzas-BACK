import transporter from "../config/emailConfig";
import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

/**
 * Sends a custom email using the configured transporter.
 * Requires recipient email, subject, plain text, and optional template context.
 */
export const sendEmail = async (req: Request, res: Response) => {
  const { to, subject, text, name, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      template: "plantilla", // Optional: use if handlebars template is configured
      context: { name, message },
    });

    console.log(`Email sent to ${to}`);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Error sending email: " + error.message });
  }
};

/**
 * Sends a welcome email notification to a newly registered user.
 * Uses a preconfigured handlebars template with dynamic content.
 */
export const registerNotifications = async (user: {
  name: string;
  email: string;
  role: string;
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Welcome to the platform",
    template: "plantilla",
    context: {
      name: user.name,
      message: `Welcome ${user.name}, your account has been successfully created. Your assigned role is: ${user.role}.`,
    },
  });

  console.log(`📧 Automated welcome email sent to ${user.email}`);
};

/**
 * Sends a password recovery email with a secure reset link.
 * The FRONTEND_URL must be updated with the final frontend route.
 */
export const handleRecoveryEmail = async ({
  name,
  email,
  token,
}: {
  name: string;
  email: string;
  token: string;
}) => {
  // FRONTED_URL: Replace with final frontend URL
  const resetLink = `${process.env.FRONTEND_URL}/reset?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Recovery",
    template: "recovery",
    context: { name, resetLink },
  });

  console.log(`📧 Password recovery email sent to ${email}`);
};