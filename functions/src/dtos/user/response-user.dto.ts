import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserModel } from '../../models/user.model';

export class ResponseUserDto {
	@IsString()
	@IsNotEmpty({ message: 'User ID is required' })
	id!: string;

	@IsString()
	@IsNotEmpty({ message: 'Email is required' })
	email!: string;

	@IsString()
	@IsNotEmpty({ message: 'First name is required' })
	firstName!: string;

	@IsString()
	@IsNotEmpty({ message: 'Last name is required' })
	lastName!: string;

	@IsString({ each: true })
	@IsNotEmpty({ message: 'Roles are required' })
	roles!: string[];

	@IsString()
	@IsNotEmpty({ message: 'Created at is required' })
	createdAt!: string;

	@IsOptional()
	@IsString()
	token?: string | null;

	static fromModel(model: UserModel, token?: string | null): ResponseUserDto {
		const dto = new ResponseUserDto();
		dto.id = model.id;
		dto.email = model.email;
		dto.firstName = model.firstName;
		dto.lastName = model.lastName;
		dto.roles = model.roles;
		dto.createdAt = model.createdAt.toDate().toISOString();
		dto.token = token || null;
		return dto;
	}
}
