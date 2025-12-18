import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {
  }
  async validateUser({email, password}: LoginDto): Promise<User> {
    const user = await this.userService.findUserByEmail(email);

    if(!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(user: User) {
    const payload= {
      sub: user.id,
      email: user.email,
      password: user.password,
    }

    return {
      access_token: this.jwtService.sign(payload),
      user:{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    }
  }

}
