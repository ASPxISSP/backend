import { Module } from '@nestjs/common';
import { ImageService } from './image.service';
import { ImageController } from './image.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
    imports: [S3Module],
    providers: [ImageService],
    controllers: [ImageController],
})
export class ImageModule {}
