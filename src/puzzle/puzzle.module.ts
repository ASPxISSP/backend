import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PuzzleService } from './puzzle.service';
import { PuzzleController } from './puzzle.controller';

@Module({
    imports: [PrismaModule],
    providers: [PuzzleService],
    exports: [PuzzleService],
    controllers: [PuzzleController],
})
export class PuzzleModule {}
