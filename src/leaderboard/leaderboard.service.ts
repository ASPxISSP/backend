import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaderboardDto } from './dto/leaderboard.dto';

@Injectable()
export class LeaderboardService {
    constructor(private readonly prisma: PrismaService) {}

    getLeaderboard(size = 10, city?: string): Promise<LeaderboardDto[]> {
        try {
            if (!city) {
                return this.prisma.user.findMany({
                    take: size,
                    orderBy: {
                        score: 'desc',
                    },
                    select: {
                        id: true,
                        name: true,
                        score: true,
                        imageUri: true,
                    },
                });
            } else {
                return this.prisma.$queryRaw`
                    SELECT "User"."id", "User"."name", "User"."score", "User"."imageUri"
                    FROM "User"
                    INNER JOIN "PuzzleSolve" ON "PuzzleSolve"."userId" = "User"."id"
                    INNER JOIN "Puzzle" ON "Puzzle"."id" = "PuzzleSolve"."puzzleId"
                    WHERE "Puzzle"."city" = ${city}
                    ORDER BY "User"."score" DESC
                    LIMIT ${size}
                `;
            }
        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException();
        }
    }
}
