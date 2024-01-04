import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { S3Module } from 'src/s3/s3.module';

@Module({
    imports: [PrismaModule, S3Module],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
