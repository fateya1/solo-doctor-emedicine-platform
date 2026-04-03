import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private client: any;

  constructor() {
    try {
      const AfricasTalking = require("africastalking");
      this.client = AfricasTalking({
        apiKey: process.env.AT_API_KEY,
        username: process.env.AT_USERNAME,
      }).SMS;
    } catch (err) {
      this.logger.warn("Africa's Talking SMS client failed to initialize");
    }
  }

  async send(to: string, message: string): Promise<void> {
    if (!this.client) {
      this.logger.warn("SMS client not initialized — skipping SMS");
      return;
    }

    // Normalize phone number to international format
    let phone = to.replace(/\s+/g, "");
    if (phone.startsWith("0")) phone = "+254" + phone.slice(1);
    if (!phone.startsWith("+")) phone = "+" + phone;

    try {
      await this.client.send({
        to: [phone],
        message,
        from: process.env.AT_SENDER_ID || undefined,
      });
      this.logger.log(`SMS sent to ${phone}`);
    } catch (err: any) {
      this.logger.error(`SMS failed to ${phone}: ${err.message}`);
    }
  }

  async sendAppointmentReminder(
    phone: string,
    patientName: string,
    doctorName: string,
    dateStr: string,
  ): Promise<void> {
    const message =
      `Hi ${patientName}, reminder: You have an appointment with Dr. ${doctorName} on ${dateStr}. ` +
      `Log in at ${process.env.FRONTEND_URL} to view details. - SoloDoc`;
    await this.send(phone, message);
  }

  async sendAppointmentConfirmationSms(
    phone: string,
    patientName: string,
    doctorName: string,
    dateStr: string,
  ): Promise<void> {
    const message =
      `Hi ${patientName}, your appointment with Dr. ${doctorName} on ${dateStr} is confirmed. ` +
      `- SoloDoc`;
    await this.send(phone, message);
  }

  async sendAppointmentCancellationSms(
    phone: string,
    name: string,
    dateStr: string,
  ): Promise<void> {
    const message =
      `Hi ${name}, your appointment on ${dateStr} has been cancelled. ` +
      `Visit ${process.env.FRONTEND_URL} to reschedule. - SoloDoc`;
    await this.send(phone, message);
  }
}