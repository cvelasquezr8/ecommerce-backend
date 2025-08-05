import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  userName!: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Roles cannot be empty if provided' })
  @IsString({ each: true })
  roles!: string[];
}
