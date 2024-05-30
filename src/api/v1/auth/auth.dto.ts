import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from '@nestjs/class-validator';

export class AuthInput {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsString()
  surname: string

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  password: string;
}

export class LogInInput {
  
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  password: string;
}