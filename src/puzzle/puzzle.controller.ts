import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Req,
    UseGuards,
    ValidationPipe,
} from '@nestjs/common';
import { FindManyQueryDto } from './dto/find-many.dto';
import { PuzzleService } from './puzzle.service';
import { PuzzleSolutionDto } from './dto/puzzle-solution.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FindOneDto } from './dto/find-one.dto';

@Controller('puzzle')
export class PuzzleController {
    constructor(private readonly puzzleService: PuzzleService) {}

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    findOne(@Param(ValidationPipe) params: FindOneDto) {
        const { id } = params;
        return this.puzzleService.findOne(id);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    findMany(@Query(ValidationPipe) query: FindManyQueryDto) {
        const { page, size, city } = query;
        return this.puzzleService.findMany(page, size, city);
    }

    @Post(':id/solve')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    solve(
        @Param(ValidationPipe) params: FindOneDto,
        @Req() req,
        @Body(ValidationPipe) puzzleSolutionDto: PuzzleSolutionDto,
    ) {
        const puzzleId = params.id;
        return this.puzzleService.solvePuzzle(
            req.user.id,
            puzzleId,
            puzzleSolutionDto,
        );
    }
}
