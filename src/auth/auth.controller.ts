import { Controller, Post, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  // 5 attempts per minute
  @Throttle({ short: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser({
      email: loginDto.email,
      password: loginDto.password,
    });

    return this.authService.login(user);
  }
}
