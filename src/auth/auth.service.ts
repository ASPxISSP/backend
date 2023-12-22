import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Tokens } from './types/tokens.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async generateTokens(id: string, email: string): Promise<Tokens> {
        const payload = { email, sub: id };
        return {
            accessToken: this.jwtService.sign(payload),
            refreshToken: this.jwtService.sign(payload, {
                expiresIn: this.configService.get<string>(
                    'REFRESH_TOKEN_EXPIRATION',
                ),
            }),
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            return user;
        }
        return null;
    }

    async login(email: string, password: string): Promise<Tokens> {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException();
        }
        return this.generateTokens(user.id, user.email);
    }

    async register(user: CreateUserDto) {
        const existingUser = await this.userService.findById(user.email);
        if (existingUser) {
            throw new ConflictException('User already exists');
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
            const user = await this.userService.findByEmail(payload.email);
            if (!user) {
                throw new UnauthorizedException();
            }
            return this.generateTokens(user.id, user.email);
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}
