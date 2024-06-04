import { Body, Controller, Get, Post, Query, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CaptchaSession,
  ForgotPasswordDto,
  SigninDto,
  SignupDto,
  resetPasswordDto,
} from 'src/dto/user.dto';
import { Public } from 'src/decorator/public.decorator';
import { User } from 'src/decorator/user.decorator';
import { CaptchaService } from 'src/tool/captcha/captcha.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  @Get('users')
  getUsers(@User() user: any) {
    console.log(user);
    return this.authService.getUsers();
  }

  @Public()
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('forgot-password')
  @Public()
  forgotPassword(
    @Body() data: ForgotPasswordDto,
    @Session() session: CaptchaSession,
  ) {
    return this.authService.forgotPassword(data, session);
  }

  @Get('reset-password')
  @Public()
  validateToken(@Query('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Post('reset-password')
  @Public()
  resetPassword(@Body() data: resetPasswordDto) {
    return this.authService.resetPassword(data);
  }

  @Get('captcha')
  @Public()
  generateCaptcha(@Session() session: CaptchaSession) {
    return this.captchaService.generateCaptcha(session);
  }

  @Post('captcha')
  @Public()
  verifyCaptcha(
    @Body('captcha') text: string,
    @Session() session: CaptchaSession,
  ) {
    return this.captchaService.verifyCaptcha(text, session);
  }
}
