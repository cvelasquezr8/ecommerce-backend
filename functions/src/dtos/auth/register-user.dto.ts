import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsArray,
	ArrayNotEmpty,
} from 'class-validator';

export class RegisterUserDto {
	@IsString()
	@IsNotEmpty({ message: 'First name is required' })
	firstName!: string;

	@IsString()
	@IsNotEmpty({ message: 'Last name is required' })
	lastName!: string;

	@IsString()
	@IsNotEmpty({ message: 'Password is required' })
	password!: string;

	@IsEmail({}, { message: 'Invalid email address' })
	email!: string;

	@IsArray()
	@ArrayNotEmpty({ message: 'Roles cannot be empty if provided' })
	@IsString({ each: true })
	roles!: string[];
}
