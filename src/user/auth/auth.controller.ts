import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailDto,
  SigninDto,
  SignupDto,
  resetPasswordDto,
} from 'src/dto/user.dto';
import { Public } from 'src/decorator/public.decorator';
import { User } from 'src/decorator/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  forgotPassword(@Body() email: EmailDto) {
    return this.authService.forgotPassword(email);
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
}
