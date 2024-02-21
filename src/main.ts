import { NestFactory, Reflector, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded, json } from 'body-parser';
import * as compression from 'compression';
import { Logger } from '@nestjs/common';
import { PROVIDER_TOKENS } from 'common/constants';
import { HttpExceptionsFilter } from 'filters/httpException.filter';
import { AuthGuard } from 'guards/auth.guard';
import { HttpValidationPipe } from 'pipes/httpValidation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors(); // Enable CORS
  app.use(compression()); // Node.js compression middleware.
  app.use(json({ limit: '50mb' })); // Limit json
  app.use(urlencoded({ limit: '50mb', extended: true })); // Limit url

  // #=======================#
  // # ==> GLOBAL GUARDS <== #
  // #=======================#
  const reflector = app.get(Reflector);
  const userService = app.get(PROVIDER_TOKENS.USER_SERVICE);
  app.useGlobalGuards(new AuthGuard(reflector, userService));

  // #======================#
  // # ==> GLOBAL PIPES <== #
  // #======================#
  app.useGlobalPipes(new HttpValidationPipe({ whitelist: true }));

  // #========================#
  // # ==> GLOBAL FILTERS <== #
  // #========================#
  const httpAdapterHost = app.get(HttpAdapterHost);
  const logger: Logger = app.get(PROVIDER_TOKENS.LOGGER);
  app.useGlobalFilters(new HttpExceptionsFilter(httpAdapterHost, logger));

  // #=================#
  // # ==> SWAGGER <== #
  // #=================#
  const swaggerPath = 'documentation';
  const documentConfig = new DocumentBuilder()
    .setTitle('Survey Master Documentation')
    .setDescription('The Survey Master API description')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup(swaggerPath, app, document);

  // #===========================#
  // # ==> START APPLICATION <== #
  // #===========================#
  const { PORT = 3001, NODE_ENV } = process.env;
  await app.listen(parseInt(`${PORT}`));
  logger.debug(
    `==> APP IS RUNNING | PORT: ${PORT} <== ${
      NODE_ENV === 'dev' ? `[http://localhost:${PORT}/${swaggerPath}]` : ''
    }`,
    'APPLICATION',
  );
}
bootstrap();
