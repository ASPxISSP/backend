import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PuzzleModule } from './puzzle/puzzle.module';

@Module({
    imports: [ConfigModule.forRoot(), UserModule, AuthModule, PuzzleModule],
})
export class AppModule {}
