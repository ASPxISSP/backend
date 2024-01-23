import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PuzzleService } from './puzzle.service';
import { PuzzleController } from './puzzle.controller';
import { ImageModule } from 'src/image/image.module';

@Module({
    imports: [PrismaModule, ImageModule],
    providers: [PuzzleService],
    exports: [PuzzleService],
    controllers: [PuzzleController],
})
export class PuzzleModule {}
