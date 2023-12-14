import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { FindManyQueryDto } from './dto/find-many';
import { PuzzleService } from './puzzle.service';

@Controller('puzzle')
export class PuzzleController {
    constructor(private readonly puzzleService: PuzzleService) {}

    @Get()
    findMany(@Query(ValidationPipe) query: FindManyQueryDto) {
        return this.puzzleService.findMany(query.page, query.size, query.city);
    }
}
