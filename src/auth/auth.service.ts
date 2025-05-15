/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user: User | null = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    if (user.password !== password) {
      throw new InternalServerErrorException('Invalid password');
    }

    return user;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.validateUser(email, password);

    return this.registerToken(user);
  }

  async signUp(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    Logger.log(email, password);
    const user: User = await this.prismaService.user.create({
      data: { email, password },
    });

    return this.registerToken(user);
  }

  registerToken(user: User): { access_token: string } {
    const payload = { username: user.email, sub: user.id };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
