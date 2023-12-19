import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ConflictException,
    ForbiddenException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, Puzzle } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindManyResponseDto } from './dto/find-many.dto';
import { PuzzleSolutionDto } from './dto/puzzle-solution.dto';
import { isWithinRadius } from 'src/helpers/isWithinRadius';
import { puzzleScore } from 'src/constants/puzzle-score';

@Injectable()
export class PuzzleService {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(id: number): Promise<Puzzle> {
        try {
            const puzzle = await this.prisma.puzzle.findUnique({
                where: {
                    id,
                },
            });
            if (!puzzle) {
                throw new NotFoundException();
            }
            return puzzle;
        } catch (err) {
            if (err instanceof NotFoundException) {
                throw err;
            }
            if (
                err instanceof Prisma.PrismaClientKnownRequestError ||
                err instanceof Prisma.PrismaClientValidationError
            ) {
                throw new BadRequestException();
            }
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async findMany(
        page = 1,
        size = 10,
        city?: string,
    ): Promise<FindManyResponseDto> {
        try {
            const [puzzles, total] = await this.prisma.$transaction([
                this.prisma.puzzle.findMany({
                    take: size,
                    skip: (page - 1) * size,
                    where: {
                        ...(city ? { city } : {}),
                    },
                }),
                this.prisma.puzzle.count({
                    where: {
                        ...(city ? { city } : {}),
                    },
                }),
            ]);

            return {
                data: puzzles,
                meta: {
                    page,
                    size,
                    total,
                    ...(city ? { city } : {}),
                },
            };
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError) {
                throw new BadRequestException();
            }
            console.log(err);
            throw new InternalServerErrorException();
        }
    }

    async solvePuzzle(
        userId: string,
        puzzleId: number,
        puzzleSolutionDto: PuzzleSolutionDto,
    ): Promise<{ score: number }> {
        const { solution, latitude, longitude } = puzzleSolutionDto;

        const puzzle = await this.prisma.puzzle.findUnique({
            where: {
                id: puzzleId,
            },
        });
        if (!puzzle) {
            throw new NotFoundException();
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new ForbiddenException();
        }

        const inRadius = isWithinRadius(
            puzzle.latitude,
            puzzle.longitude,
            latitude,
            longitude,
            100,
        );

        const isCorrect = puzzle.solution === solution;

        if (!isCorrect || !inRadius) {
            throw new UnprocessableEntityException(
                'Invalid solution or location',
            );
        }

        const hasSolved = await this.prisma.puzzleSolve.findFirst({
            where: {
                userId,
                puzzleId,
            },
        });

        if (hasSolved) {
            throw new ConflictException();
        }
        try {
            await this.prisma.$transaction([
                this.prisma.puzzleSolve.create({
                    data: {
                        puzzleId,
                        userId,
                    },
                }),
                this.prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        score: {
                            increment: puzzleScore(puzzle.difficulty),
                        },
                    },
                }),
            ]);

            return {
                score: puzzleScore(puzzle.difficulty),
            };
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}
