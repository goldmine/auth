import { Module } from '@nestjs/common';
import { MailerService } from './mailer/mailer.service';
import { TokenService } from './token/token.service';
import { PasswordService } from './password/password.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { CaptchaService } from './captcha/captcha.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport:
          'smtps://lbbwshinvoice@sina.com:79fecb1b116382ff@smtp.sina.com',
        defaults: {
          from: '"lbbw" <lbbwshinvoice@sina.com>',
        },
        template: {
          dir: __dirname + '/templates',
          //adapter: new PugAdapter(),
          // options: {
          //   strict: true,
          // },
        },
      }),
    }),
  ],

  providers: [MailerService, TokenService, PasswordService, CaptchaService],
  exports: [MailerService, TokenService, PasswordService, CaptchaService],
})
export class ToolModule {}
