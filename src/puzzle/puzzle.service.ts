import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindManyResponseDto } from './dto/find-many';
import { Puzzle } from '@prisma/client';

@Injectable()
export class PuzzleService {
    constructor(private readonly prisma: PrismaService) {}

    async findOne(id: string): Promise<Puzzle> {
        return this.prisma.puzzle.findUnique({
            where: {
                id,
            },
        });
    }

    async findMany(
        page = 1,
        size = 10,
        city?: string,
    ): Promise<FindManyResponseDto> {
        try {
            const puzzles = await this.prisma.puzzle.findMany({
                take: size,
                skip: (page - 1) * size,
                where: {
                    ...(city ? { city } : {}),
                },
            });
            const total = await this.prisma.puzzle.count({
                where: {
                    ...(city ? { city } : {}),
                },
            });

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
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}
