import { ISocket } from 'gateways/socket.gateway';
import { Logger } from '@nestjs/common';
import { SOCKET_EVENT_NAME, LOGGER_CONTEXTS } from 'common/constants';

export const wsLoggerMiddleware = (
  logger: Logger,
  client: ISocket,
  next: () => void,
) => {
  client.onAny((eventName) => {
    const { id, auth } = client;
    const loggerMessage = `EVENT NAME: ${eventName} - CLIENT ID: ${id} [${auth.email}]`;

    // CASE: Event name invalid
    if (!Object.values(SOCKET_EVENT_NAME).includes(eventName)) {
      logger.warn(`INVALID ${loggerMessage}`, LOGGER_CONTEXTS.WEBSOCKET);
      client.disconnect();
    }

    // CASE: Event name is valid
    else logger.log(loggerMessage, LOGGER_CONTEXTS.WEBSOCKET);
  });
  next();
};
