import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ISocket } from 'gateways/socket.gateway';
import { SOCKET_EVENT_NAME, LOGGER_CONTEXTS } from 'common/constants';
import { formatLoggerMessage } from 'filters/httpException.filter';

@Catch()
export class WsExceptionsFilter extends BaseWsExceptionFilter {
  private readonly logger: Logger = new Logger(LOGGER_CONTEXTS.WEBSOCKET);

  catch(exception: WsException, host: ArgumentsHost) {
    // Format logger message
    const { message, stack } = exception;
    const client: ISocket = host.switchToWs().getClient();
    const { id, auth } = client;
    const loggerMessage = formatLoggerMessage(stack, message);

    // Display WS error message
    this.logger.error(`[${auth.email}] | CLIENT ID: ${id} - ${loggerMessage}`);

    // Emit error message
    client.emit(SOCKET_EVENT_NAME.ERROR, { message });
  }
}
