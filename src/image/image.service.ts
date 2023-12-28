import { Injectable, NotFoundException } from '@nestjs/common';
import { S3Service } from 'src/s3/s3.service';
import { Image } from './dto/image.dto';

@Injectable()
export class ImageService {
    constructor(private readonly s3Service: S3Service) {}

    async getAvatar(key: string): Promise<Image> {
        try {
            return {
                name: key,
                url: await this.s3Service.getObjectUrl('avatars/' + key),
            };
        } catch (err) {
            throw new NotFoundException();
        }
    }

    async getAvatars(): Promise<Image[]> {
        const avatarKeys = await this.s3Service.listObjects('avatars/');
        const avatars = await Promise.all(
            avatarKeys.map(async ({ Key }) => {
                return {
                    name: Key,
                    url: await this.s3Service.getObjectUrl(
                        'avatars/' + Key,
                        false,
                    ),
                };
            }),
        );
        return avatars;
    }

    async getPuzzleImage(key: string): Promise<Image> {
        try {
            return {
                name: key,
                url: await this.s3Service.getSignedUrl('puzzles/' + key, 12 * 3600),
            };
        } catch (err) {
            throw new NotFoundException();
        }
    }
}
