import * as bcrypt from 'bcrypt';
import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserProfileDto } from './dto/profile.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                id,
            },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    async findMany(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, orderBy } = params;

        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            orderBy,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        if (data.password) {
            const hashedPassword = await bcrypt.hash(
                data.password as string,
                10,
            );
            data.password = hashedPassword;
        }
        return this.prisma.user.update({
            data: {
                ...data,
                updatedAt: new Date(),
            },
            where: {
                id,
            },
        });
    }

    async deleteUser(id: string): Promise<void> {
        try {
            await this.prisma.user.delete({
                where: {
                    id,
                },
            });
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new NotFoundException();
            }
            throw new InternalServerErrorException();
        }
    }

    async profile(id: string): Promise<UserProfileDto> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException();
        }
        const { email, name, imageId, score } = user;
        return {
            id,
            email,
            name,
            imageId,
            score,
        };
    }
}
