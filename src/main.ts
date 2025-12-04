import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEYS } from './config/config.keys';
import { getConfigValues } from './config/configuration';
import { writeFileSync } from 'fs';
import { Response } from 'express';
import { join } from 'path';

async function bootstrap() {
  const response = await getConfigValues();

  console.log('secrets pulled', response);
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      preflightContinue: false,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    },
  });

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('operations/api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('DigiLog Operation API Documentation')
    .setDescription('The DigiLog Operation API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional: just a hint for Swagger UI
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // This name is used in the decorator below
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // writeFileSync(
  //   join(process.cwd(), 'swagger.json'),
  //   JSON.stringify(document, null, 2),
  // );
  // const swaggerFile = join(process.cwd(), 'swagger.json');
  // app.getHttpAdapter().get('/operations/swagger-json', (req, res: Response) => {
  //   res.sendFile(swaggerFile);
  // });

  SwaggerModule.setup('operations/api/docs', app, document);
  await app.listen(configService.get<number>(CONFIG_KEYS.PORT) || 3003);
}
bootstrap();
