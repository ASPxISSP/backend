import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    S3Client,
    GetObjectCommand,
    ListObjectsV2Command,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
    constructor(private readonly configService: ConfigService) {}

    private bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    private region = this.configService.get('AWS_REGION');

    private s3Client = new S3Client({
        region: this.region,
        credentials: {
            accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
            secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
        },
    });

    async getObjectUrl(key: string, check = true): Promise<string> {
        if (check) {
            const objectExists = await this.objectExists(key);
            if (!objectExists) {
                throw new Error('Object does not exist');
            }
        }
        return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    }

    async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
        const objectExists = await this.objectExists(key);
        if (!objectExists) {
            throw new Error('Object does not exist');
        }
        return getSignedUrl(
            this.s3Client,
            new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            }),
            expiresIn === 0 ? undefined : { expiresIn },
        );
    }

    async listObjects(folderPath: string): Promise<{ Key: string }[]> {
        const response = await this.s3Client.send(
            new ListObjectsV2Command({
                Bucket: this.bucketName,
                Prefix: folderPath,
            }),
        );
        const filteredObjects = (response.Contents || []).filter(
            (obj) => obj.Key !== folderPath,
        );
        return filteredObjects.map(({ Key }) => ({ Key }));
    }

    async objectExists(key: string): Promise<boolean> {
        try {
            await this.s3Client.send(
                new HeadObjectCommand({
                    Bucket: this.bucketName,
                    Key: key,
                }),
            );
            return true;
        } catch (err) {
            return false;
        }
    }
}
