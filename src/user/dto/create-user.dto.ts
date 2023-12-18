import { IsEmail, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

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

    @IsInt({ message: 'Image ID must be an integer' })
    @IsNotEmpty({ message: 'Image ID cannot be empty' })
    imageId: number;
}
