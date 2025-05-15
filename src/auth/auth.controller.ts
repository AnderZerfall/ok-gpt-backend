import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getCurrentUser(@Req() req: { user: User }) {
    return req.user;
  }

  @Post('sign-up')
  signUp(@Body() dto: { email: string; password: string }) {
    return this.authService.signUp(dto.email, dto.password);
  }

  @Post('sign-in')
  signIn(@Body() dto: { email: string; password: string }) {
    return this.authService.login(dto.email, dto.password);
  }
}
