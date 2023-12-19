import * as bcrypt from 'bcrypt';
import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { Prisma, Puzzle, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserProfileDto } from './dto/profile.dto';
import { UserPuzzleDto } from './dto/user-puzzle.dto';

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
        const { email, name, imageUri, score } = user;
        return {
            id,
            email,
            name,
            imageUri,
            score,
        };
    }

    async puzzleSolves(
        id: string,
        city?: string,
    ): Promise<Puzzle[] | UserPuzzleDto[]> {
        const user = await this.findById(id);
        if (!user) {
            throw new ForbiddenException();
        }

        if (!city) {
            return this.prisma.puzzle.findMany({
                where: {
                    PuzzleSolve: {
                        some: {
                            userId: id,
                        },
                    },
                },
                orderBy: {
                    puzzleOrder: 'asc',
                },
            });
        } else {
            return this.prisma.$queryRaw`
                WITH "UserPuzzleSolve" AS(
                        SELECT
                            "PuzzleSolve"."puzzleId",
                            "PuzzleSolve"."userId",
                            "PuzzleSolve"."id"
                        FROM
                            "PuzzleSolve"
                        WHERE
                            "PuzzleSolve"."userId" = ${id}
                    ),
                    "SolvedPuzzles" AS (
                        SELECT
                            "Puzzle".*,
                            CASE
                                WHEN "UserPuzzleSolve"."id" IS NULL THEN FALSE
                                ELSE TRUE
                            END as "isSolved",
                            LAG(CASE
                                WHEN "UserPuzzleSolve"."id" IS NULL THEN FALSE
                                ELSE TRUE
                            END) OVER (ORDER BY "Puzzle"."puzzleOrder") AS "prev_isSolved"
                        FROM "Puzzle"
                        LEFT JOIN "UserPuzzleSolve" ON "UserPuzzleSolve"."puzzleId" = "Puzzle"."id"
                        WHERE "Puzzle"."city" = 'Wrocław'
                    )
                SELECT
                    "id",
                    "solution",
                    "difficulty",
                    "latitude",
                    "longitude",
                    "address",
                    "city",
                    "imageUri",
                    "puzzleOrder",
                    "isSolved",
                    CASE
                        WHEN "isSolved" = FALSE
                        AND "prev_isSolved" = TRUE THEN TRUE
                        -- WHEN "true_count" = 0 THEN TRUE
                        ELSE "isSolved"
                    END AS "isUnlocked"
                FROM
                    "SolvedPuzzles"
                ORDER BY
                    "puzzleOrder" ASC;
                `;
        }
    }
}
