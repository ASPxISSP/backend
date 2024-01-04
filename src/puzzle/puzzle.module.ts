import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PuzzleService } from './puzzle.service';
import { PuzzleController } from './puzzle.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
    imports: [PrismaModule, S3Module],
    providers: [PuzzleService],
    exports: [PuzzleService],
    controllers: [PuzzleController],
})
export class PuzzleModule {}
