import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

const configService = new ConfigService();
const PORT = configService.get('PORT') || 5000;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
    });
    app.useBodyParser('json');
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    await app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
bootstrap();
