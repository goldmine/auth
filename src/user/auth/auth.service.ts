import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CaptchaSession,
  ForgotPasswordDto,
  SigninDto,
  SignupDto,
  resetPasswordDto,
} from 'src/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CaptchaService } from 'src/tool/captcha/captcha.service';
import { MailerService } from 'src/tool/mailer/mailer.service';
import { PasswordService } from 'src/tool/password/password.service';
import { TokenService } from 'src/tool/token/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly mailerService: MailerService,
    private readonly captchaService: CaptchaService,
  ) {}

  async getUsers() {
    return await this.prismaService.user.findMany();
  }

  async signup(data: SignupDto) {
    try {
      data.password = this.passwordService.hashPassword(data.password);
      const { id, email } = await this.prismaService.user.create({
        data,
      });

      return this.tokenService.createToken({ id, email });
    } catch (e) {
      if (e.code == 'P2002') {
        throw new HttpException('email or phone has been used!', 500);
      } else {
        console.log(e);
        throw new BadRequestException();
      }
    }
  }

  async signin(data: SigninDto) {
    const user = await this.findUserByEmail(data.email);

    if (
      !user ||
      !this.passwordService.comparePassword(data.password, user.password)
    ) {
      throw new HttpException('bad credential!', 400);
    }

    const { id, email } = user;
    return await this.tokenService.createToken({ id, email });
  }

  async forgotPassword(
    { email, captcha }: ForgotPasswordDto,
    session: CaptchaSession,
  ) {
    try {
      this.captchaService.verifyCaptcha(captcha, session);
    } catch (e) {
      throw new HttpException('captcha not correct', 400);
    }

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('user not found!', 400);
    }

    await this.mailerService.sendPasswordResetEmail(user.email);

    return { message: 'email sent!' };
  }

  async validateToken(token: string) {
    const payload = await this.tokenService.decodeToken(token);
    if (
      payload &&
      payload['email'] &&
      (await this.findUserByEmail(payload['email']))
    ) {
      return { message: 'token is correct' };
    }

    throw new UnauthorizedException();
  }

  async resetPassword(data: resetPasswordDto) {
    const { email, password, passwordConfirmation } = data;

    if (password !== passwordConfirmation) {
      throw new BadRequestException();
    }

    const hashedPassword = this.passwordService.hashPassword(password);

    const user = await this.prismaService.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return user;
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }
}
