import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Tokens } from './types/tokens.type';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async generateTokens(userId: string, email: string): Promise<Tokens> {
        const payload = { email, sub: userId };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findOne(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async profile(email: string) {
        const user = await this.userService.findOne(email);
        if (!user) {
            throw new UnauthorizedException();
        }

        const { id, name, score } = user;
        return { id, email, name, score };
    }

    async login(email: string, password: string): Promise<Tokens> {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.generateTokens(user.id, user.email);
    }

    async register(user: CreateUserDto) {
        const existingUser = await this.userService.findOne(user.email);
        if (existingUser) {
            throw new BadRequestException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await this.userService.createUser({
            ...user,
            password: hashedPassword,
        });
        return {
            message: 'User created successfully',
        };
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new BadRequestException();
        }
        try {
            const payload = this.jwtService.verify(refreshToken);
            const user = await this.userService.findOne(payload.email);
            if (!user) {
                throw new UnauthorizedException();
            }
            return this.generateTokens(user.id, user.email);
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
