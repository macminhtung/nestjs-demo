import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

export const formatLoggerMessage = (stack: any, message: string) => {
  const errorLines: string[] = stack?.split('\n')?.slice(1, 4);
  return `${message}\n${errorLines?.reduce(
    (prevV: string, curV: string, idx: number) =>
      prevV + `- ${curV?.trim()}${idx < errorLines.length - 1 ? '\n' : ''}`,
    '',
  )}\n`;
};

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: Logger,
  ) {}

  catch(
    exception: { status: number; message: string; stack: any },
    host: ArgumentsHost,
  ) {
    // Format logger message
    const {
      status = HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      stack,
    } = exception;
    const loggerMessage = formatLoggerMessage(stack, message);

    // Display error message
    if (status >= 500) this.logger.error(loggerMessage);
    else this.logger.warn(loggerMessage);

    // Response http request
    const { httpAdapter } = this.httpAdapterHost;
    const response = host.switchToHttp().getResponse();
    httpAdapter.reply(
      response,
      { statusCode: status, message, error: true },
      status,
    );
  }
}
