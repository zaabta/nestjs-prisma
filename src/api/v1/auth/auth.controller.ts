import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Version,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthInput, LogInInput } from './auth.dto';
import { GetCurrentToken, GetCurrentUserId, Public } from '../../../decorator';

@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Version('1')
  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() input: AuthInput) {
    return this.authService.register(input);
  }

  @Public()
  @Version('1')
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() input: LogInInput) {
    return this.authService.logIn(input);
  }

  @Version('1')
  @Get()
  @HttpCode(HttpStatus.OK)
  getProfile(@GetCurrentUserId() userId: number) {
    return this.authService.getProfile(userId);
  }

  @Version('1')
  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentToken() token: string): Promise<boolean> {
    return this.authService.logout(token);
  }
}
