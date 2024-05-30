import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';
import { AuthInput, LogInInput } from './auth.dto';
import { DatabaseService } from 'src/database/database.service';

export const dbMock = {
  auth: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: DatabaseService,
          useValue: dbMock,
        },
      ],
    }).compile();

    it('Auth Service should be defined', () => {
      expect(AuthService).toBeDefined();
    });

    authService = module.get<AuthService>(AuthService);
    dbMock.auth.findFirst.mockClear();
    dbMock.auth.create.mockClear();
  });

  describe('register', () => {
    it('should return registered User', async () => {
      const userCreateDto: AuthInput = {
        name: 'ali',
        surname: 'almanea',
        email: 'ali@gmail.com',
        password: '12345',
      };
      dbMock.auth.create.mockResolvedValue({
        ...userCreateDto,
      });
      const result = await authService.register(userCreateDto);
      expect(result.email).toMatch(userCreateDto.email);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
  });

  describe('login', () => {
    it('should return user if exists', async () => {
      const userLogInDto: LogInInput = {
        email: 'ali@gmail.com',
        password: '12345',
      };

      dbMock.auth.findFirst.mockResolvedValue({
        ...userLogInDto,
      });

      const result = await authService.logIn(userLogInDto);
      expect(result.user).toMatch(userLogInDto.email);
      expect(result).toHaveProperty('token');
    });

    it('should throw NotFoundException if user not exists', async () => {
      const nonExistingUserDto: LogInInput = {
        email: 'XXX@gmail.com',
        password: '12345',
      };
      const existUserLogInDto: LogInInput = {
        email: 'ali@gmail.com',
        password: '12345',
      };
      dbMock.auth.create.mockResolvedValue({
        ...existUserLogInDto,
      });
      await expect(authService.logIn(nonExistingUserDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
