import { ForbiddenException, Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../../database/database.service';
import * as argon2 from 'argon2';
import { type AuthInput, type LogInInput } from './auth.dto';
import { userSelect } from './auth.helper';


@Injectable()
export class AuthService {
  constructor(private db: DatabaseService, private jwtService: JwtService) {}

  async register(input: AuthInput) {
    const { password, ...rest } = input;
    const hash = await argon2.hash(password);
    const user = await this.db.user
      .create({
        data: {
          ...rest,
          password: hash,
        },
        select: userSelect,
      })
      .catch((error) => {
        if (error instanceof PrismaClientInitializationError) {
          if (error.errorCode === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });
    return user;
  }

  async logIn(input: LogInInput) {
    const { email, password } = input;
    const foundUser = await this.db.user.findFirst({
      where: {
        deletedAt: null,
        email: email,
      },
    });
    if (!foundUser) throw new ForbiddenException('Access Denied');
    const passwordMatches = await argon2.verify(foundUser.password, password);
    if (!passwordMatches) throw new ForbiddenException('Access Denied');
    const user = {
      id: foundUser.id,
      name: foundUser.name,
      surname: foundUser.surname,
      email: foundUser.email,
    };
    const token = await this.jwtService.sign(user);
    return {
      user,
      token,
    };
  }

  async getProfile(id: number) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      id,
    }
    return this.db.user.findFirst({where, select: userSelect })
  }

  async logout(invalidToken: string) {
    return Boolean(
      this.db.token.create({
        data: {
          invalidToken,
        },
      }),
    );
  }
}
