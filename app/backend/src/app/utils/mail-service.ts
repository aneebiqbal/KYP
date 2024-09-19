import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_EMAIL_APP_PASSWORD, // Replace with your Gmail app password
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const url = `http://3.85.127.217:3001/reset-password/${token}`;
    await this.transporter.sendMail({
      from: '"KYP" <no-reply@example.com>',
      to,
      subject: 'Password Reset',
      text: `Please reset your password using the following link: ${url}`,
      html: `<p>Please reset your password using the following link: <a href="${url}">${url}</a></p>`,
    });
  }
}
