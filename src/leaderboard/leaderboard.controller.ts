import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { FindManyQueryDto } from './dto/find-many.dto';

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @Get()
    getLeaderboard(@Query(ValidationPipe) query: FindManyQueryDto) {
        const { size, city } = query;
        return this.leaderboardService.getLeaderboard(size, city);
    }
}
