import { Controller, Get, Param } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
    constructor(private readonly imageService: ImageService) {}

    @Get('/avatar')
    getAvatars() {
        return this.imageService.getAvatars();
    }

    @Get('avatar/:key')
    getAvatar(@Param('key') key: string) {
        return this.imageService.getAvatar(key);
    }

    @Get('/puzzle/:key')
    getPuzzleImage(@Param('key') key: string) {
        return this.imageService.getPuzzleImage(key);
    }
}
