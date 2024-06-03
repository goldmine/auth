import { MailerService as EmailService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';

@Injectable()
export class MailerService {
  constructor(
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
  ) {}

  async sendPasswordResetEmail(email: string): Promise<void> {
    // 生成重设密码令牌
    const resetToken = await this.tokenService.createToken({ email, id: null });
    // 将重设密码令牌与用户的电子邮件地址关联起来（在真实应用中，可能会将其存储在数据库中）

    // 发送重设密码邮件
    await this.emailService.sendMail({
      to: email,
      subject: 'Reset Password',
      text: `${process.env.SERVER_URL}auth/reset-password?token=${resetToken}`,
    });
    console.log('email sent to: ' + email);
  }
}
