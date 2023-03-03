import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'body-parser';
import {
  ValidationPipe,
  BadRequestException,
  ValidationError,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from 'modules/user/user.service';
import { AuthGuard } from 'guards/auth.guard';
import { LoggingInterceptor } from 'interceptors/logging.interceptor';

const { PORT } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.enableCors(); // Enable CORS
  app.use(json({ limit: '50mb' })); // Limit json
  app.use(urlencoded({ limit: '50mb', extended: true })); // Limit url

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        console.error(
          '\n ==> ValidationError',
          JSON.stringify(validationErrors),
          '\n',
        );
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: JSON.stringify(validationErrors),
        });
      },
      whitelist: true,
      transform: true,
      dismissDefaultMessages: true,
      validationError: {
        target: false,
      },
    }),
  );

  // Setup global guards
  const reflector = app.get(Reflector);
  const userService = app.get<UserService>(UserService);
  app.useGlobalGuards(new AuthGuard(reflector, userService));

  // Setup swagger
  const documentConfig = new DocumentBuilder()
    .setTitle('Demo Swagger')
    .setDescription('The Demo API description')
    .setVersion('1.0')
    .addTag('Demo')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.info(`Server running on port ${PORT}`);
}
bootstrap();
