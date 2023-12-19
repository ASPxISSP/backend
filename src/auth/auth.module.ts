import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>(
                        'ACCESS_TOKEN_EXPIRATION',
                    ),
                },
                ignoreExpiration: true, // remove in prod
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [AuthService, JwtStrategy, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
