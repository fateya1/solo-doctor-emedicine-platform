import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async send(payload: EmailPayload): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"SoloDoc Platform" <${process.env.SMTP_USER}>`,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });
      this.logger.log(`Email sent to ${payload.to}: ${payload.subject}`);
    } catch (err: any) {
      this.logger.error(`Failed to send email to ${payload.to}: ${err.message}`);
    }
  }

  async sendWelcome(to: string, fullName: string, role: string): Promise<void> {
    await this.send({
      to,
      subject: "Welcome to SoloDoc!",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Welcome to SoloDoc, ${fullName}!</h1>
          <p>Your account has been created successfully as a <strong>${role}</strong>.</p>
          ${role === "DOCTOR" ? `<p>Please complete your onboarding to start accepting patients.</p>
          <a href="${process.env.FRONTEND_URL}/onboarding" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Complete Onboarding</a>` :
          `<p>You can now browse available doctors and book appointments.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard/patient" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Go to Dashboard</a>`}
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendPasswordReset(to: string, fullName: string, resetUrl: string): Promise<void> {
    await this.send({
      to,
      subject: "Reset your SoloDoc password",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <div style="text-align:center;margin-bottom:32px;">
            <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;background:#eff6ff;border-radius:12px;margin-bottom:16px;">
              <span style="font-size:24px;">🔒</span>
            </div>
            <h1 style="color:#0f172a;margin:0;font-size:24px;">Reset your password</h1>
          </div>
          <p style="color:#475569;">Hi ${fullName},</p>
          <p style="color:#475569;">We received a request to reset the password for your SoloDoc account. Click the button below to choose a new password.</p>
          <div style="text-align:center;margin:32px 0;">
            <a href="${resetUrl}" style="background:#0284c7;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;">Reset Password</a>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;color:#64748b;font-size:13px;">⏱ This link expires in <strong>1 hour</strong>.</p>
            <p style="margin:8px 0 0;color:#64748b;font-size:13px;">🔐 If you didn't request a password reset, you can safely ignore this email. Your password will not change.</p>
          </div>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${resetUrl}" style="color:#0284c7;word-break:break-all;">${resetUrl}</a>
          </p>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendAppointmentConfirmation(
    patientEmail: string,
    patientName: string,
    doctorName: string,
    startTime: Date,
    reason?: string,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    await this.send({
      to: patientEmail,
      subject: "Appointment Confirmed - SoloDoc",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Appointment Confirmed</h1>
          <p>Hi ${patientName},</p>
          <p>Your appointment has been confirmed with <strong>Dr. ${doctorName}</strong>.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Date & Time:</strong> ${dateStr}</p>
            ${reason ? `<p style="margin:8px 0 0;"><strong>Reason:</strong> ${reason}</p>` : ""}
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard/patient" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Appointment</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendAppointmentNotificationToDoctor(
    doctorEmail: string,
    doctorName: string,
    patientName: string,
    startTime: Date,
    reason?: string,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    await this.send({
      to: doctorEmail,
      subject: "New Appointment Booked - SoloDoc",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">New Appointment</h1>
          <p>Hi Dr. ${doctorName},</p>
          <p><strong>${patientName}</strong> has booked an appointment with you.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Date & Time:</strong> ${dateStr}</p>
            ${reason ? `<p style="margin:8px 0 0;"><strong>Reason:</strong> ${reason}</p>` : ""}
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard/doctor" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Dashboard</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendAppointmentCancellation(
    to: string,
    name: string,
    role: string,
    startTime: Date,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    await this.send({
      to,
      subject: "Appointment Cancelled - SoloDoc",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#dc2626;">Appointment Cancelled</h1>
          <p>Hi ${role === "DOCTOR" ? "Dr. " : ""}${name},</p>
          <p>An appointment scheduled for <strong>${dateStr}</strong> has been cancelled.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard/${role.toLowerCase()}" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Dashboard</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendVerificationApproved(to: string, fullName: string): Promise<void> {
    await this.send({
      to,
      subject: "Your Account Has Been Verified - SoloDoc",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#16a34a;">Account Verified!</h1>
          <p>Hi Dr. ${fullName},</p>
          <p>Congratulations! Your doctor account has been verified by our admin team.</p>
          <p>You can now accept patients and manage your availability slots.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard/doctor" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Go to Dashboard</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendPaymentReceipt(
    to: string,
    fullName: string,
    amount: number,
    plan: string,
    mpesaReceiptNo: string,
    periodEnd: Date,
  ): Promise<void> {
    const dateStr = periodEnd.toLocaleDateString("en-KE", { dateStyle: "full" });
    await this.send({
      to,
      subject: "Payment Receipt - SoloDoc Subscription",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Payment Receipt</h1>
          <p>Hi Dr. ${fullName},</p>
          <p>Thank you for your payment. Your subscription has been activated.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Plan:</strong> ${plan}</p>
            <p style="margin:8px 0 0;"><strong>Amount:</strong> KES ${amount.toLocaleString()}</p>
            <p style="margin:8px 0 0;"><strong>M-Pesa Receipt:</strong> ${mpesaReceiptNo}</p>
            <p style="margin:8px 0 0;"><strong>Valid Until:</strong> ${dateStr}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard/doctor" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Go to Dashboard</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendSubscriptionRenewalReminder(
    to: string,
    fullName: string,
    plan: string,
    expiryDate: Date,
    daysLeft: number,
  ): Promise<void> {
    const dateStr = expiryDate.toLocaleDateString("en-KE", { dateStyle: "full" });
    await this.send({
      to,
      subject: `Your SoloDoc subscription expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#d97706;">Subscription Expiring Soon</h1>
          <p>Hi Dr. ${fullName},</p>
          <p>Your <strong>${plan}</strong> plan expires on <strong>${dateStr}</strong> (${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining).</p>
          <p>Renew now to keep your account active and continue accepting patients without interruption.</p>
          <a href="${process.env.FRONTEND_URL}/dashboard/doctor" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Renew Subscription</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendVideoConsultationInvite(
    to: string,
    patientName: string,
    doctorName: string,
    appointmentId: string,
    startTime: Date,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    const joinUrl = `${process.env.FRONTEND_URL}/dashboard/patient?video=${appointmentId}`;
    await this.send({
      to,
      subject: "Your Video Consultation is Ready - SoloDoc",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Video Consultation Ready</h1>
          <p>Hi ${patientName},</p>
          <p>Dr. ${doctorName} has started your video consultation room.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Appointment:</strong> ${dateStr}</p>
          </div>
          <a href="${joinUrl}" style="background:#0284c7;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;font-weight:600;">Join Video Call</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendAppointmentReminder(
    to: string,
    patientName: string,
    doctorName: string,
    startTime: Date,
    timeUntil: string,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    await this.send({
      to,
      subject: `Appointment Reminder: ${timeUntil} until your consultation - SoloDoc`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Appointment Reminder</h1>
          <p>Hi ${patientName},</p>
          <p>This is a reminder that you have an appointment with <strong>Dr. ${doctorName}</strong> in <strong>${timeUntil}</strong>.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Date & Time:</strong> ${dateStr}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard/patient" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Appointment</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }

  async sendAppointmentReminderToDoctor(
    to: string,
    doctorName: string,
    patientName: string,
    startTime: Date,
    timeUntil: string,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    await this.send({
      to,
      subject: `Upcoming Appointment Reminder: ${timeUntil} - SoloDoc`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Upcoming Appointment</h1>
          <p>Hi Dr. ${doctorName},</p>
          <p>You have an appointment with <strong>${patientName}</strong> in <strong>${timeUntil}</strong>.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Date & Time:</strong> ${dateStr}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard/doctor" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Dashboard</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }
  async sendFollowUpNotification(
    to: string,
    patientName: string,
    doctorName: string,
    startTime: Date,
    reason: string,
  ): Promise<void> {
    const dateStr = startTime.toLocaleString("en-KE", { dateStyle: "full", timeStyle: "short" });
    await this.send({
      to,
      subject: "Follow-up Appointment Scheduled - SoloDoc",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Follow-up Appointment Scheduled</h1>
          <p>Hi ${patientName},</p>
          <p>Dr. ${doctorName} has scheduled a follow-up appointment for you.</p>
          <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin:16px 0;">
            <p style="margin:0;"><strong>Date & Time:</strong> ${dateStr}</p>
            <p style="margin:8px 0 0;"><strong>Reason:</strong> ${reason}</p>
          </div>
          <a href="${process.env.FRONTEND_URL}/dashboard/patient" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">View Appointment</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">The SoloDoc Team</p>
        </div>
      `,
    });
  }
  async sendWaitlistNotification(
    to: string,
    patientName: string,
    doctorName: string,
    doctorProfileId: string,
  ): Promise<void> {
    await this.send({
      to,
      subject: `A slot is now available with Dr. ${doctorName} - SoloDoc`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;">
          <h1 style="color:#0284c7;">Good news, ${patientName}!</h1>
          <p>A slot has just become available with <strong>Dr. ${doctorName}</strong>.</p>
          <p>Book now before it fills up — slots go fast!</p>
          <a href="${process.env.FRONTEND_URL}/doctors/${doctorProfileId}" style="background:#0284c7;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Book Now</a>
          <p style="color:#64748b;margin-top:32px;font-size:14px;">You received this because you joined the waitlist for Dr. ${doctorName}. The SoloDoc Team</p>
        </div>
      `,
    });
  }
}