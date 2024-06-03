import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  EmailDto,
  SigninDto,
  SignupDto,
  resetPasswordDto,
} from 'src/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }

  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }
  @Post('signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() email: EmailDto) {
    return this.authService.forgotPassword(email);
  }

  @Get('reset-password')
  validateToken(@Query('token') token: string) {
    return this.authService.validateToken(token);
  }

  @Post('reset-password')
  resetPassword(@Body() data: resetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
