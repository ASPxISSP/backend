import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString({ message: 'Password must be a string' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;

    @IsString({ message: 'ImageUri must be a string' })
    @IsNotEmpty({ message: 'ImageUri cannot be empty' })
    imageUri: string;
}
