// src/app/utils/mail.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.mailosaur.net',
      port: 587,
      secure: false,
      auth: {
        user: 'byudgj4q@mailosaur.net',
        pass: 'HlHKKCaE9odBUHWZ1FD84lSF5tGwzacE',
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const url = `http://your-frontend-url/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: '"KYP" <no-reply@example.com>',
      to,
      subject: 'Password Reset',
      text: `Please reset your password using the following link: ${url}`,
      html: `<p>Please reset your password using the following link: <a href="${url}">${url}</a></p>`,
    });
  }
}
