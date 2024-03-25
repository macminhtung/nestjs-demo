import {
  Logger,
  UseFilters,
  Inject,
  UsePipes,
  Injectable,
} from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MAIN_ENV } from 'env';
import * as jwt from 'jsonwebtoken';
import type { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import { WsExceptionsFilter } from 'filters/wsException.filter';
import {
  PROVIDER_TOKENS,
  LOGGER_CONTEXTS,
  SOCKET_EVENT_NAME,
} from 'common/constants';
import { UserService } from 'modules/user/user.service';
import { IAuthInfo } from 'decorators';
import { AUTH_REQUEST_KEY, getRoleScopeInfo } from 'guards/auth.guard';
import { WsValidationPipe } from 'pipes/wsValidation.pipe';
import { MessageBodyDto, JoinRoomBodyDto } from 'gateways/dto';
import { wsLoggerMiddleware } from 'middlewares/wsLogger.middleware';

const { SOCKET_PORT, JWT_SECRET_KEY } = MAIN_ENV.APP;

export interface ISocket extends Socket {
  [AUTH_REQUEST_KEY]: IAuthInfo;
}

@Injectable()
@UseFilters(new WsExceptionsFilter())
@UsePipes(new WsValidationPipe())
@WebSocketGateway(SOCKET_PORT, { cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public wss: Server;

  @Inject(PROVIDER_TOKENS.LOGGER)
  private logger: Logger;

  @Inject(PROVIDER_TOKENS.USER_SERVICE)
  private userService: UserService;

  // #=====================#
  // # ==> INITIALIZED <== #
  // #=====================#
  afterInit() {
    setTimeout(
      () =>
        this.logger.debug(
          `==> WEBSOCKET INITIALIZED | PORT: ${SOCKET_PORT} <==\n`,
          LOGGER_CONTEXTS.WEBSOCKET,
        ),
      100,
    );

    // Apply middleware
    this.wss.use((client: ISocket, next) =>
      wsLoggerMiddleware(this.logger, client, next),
    );
  }

  // #====================#
  // # ==> CONNECTION <== #
  // #====================#
  handleConnection(client: ISocket) {
    const token = client.handshake.headers?.token as string;

    jwt.verify(
      token,
      JWT_SECRET_KEY,
      async (err: VerifyErrors, decodedToken: JwtPayload) => {
        try {
          // CASE: Token invalid
          if (err) throw new WsException(err.message);

          // Check user existence
          const focusUser = await this.userService.checkExist({
            where: { id: decodedToken.id },
            relations: { roles: { scopes: true } },
          });

          // Check sessionTimestamp is valid
          const { id: authId, email, sessionTimestamp, roles } = focusUser;
          if (sessionTimestamp !== decodedToken.sessionTimestamp)
            throw new WsException('SessionTimestamp invalid!');

          // Update the authInfo value to the socket client
          const roleScopeInfo = getRoleScopeInfo(roles);
          const authInfo: IAuthInfo = { authId, email, ...roleScopeInfo };
          client[AUTH_REQUEST_KEY] = authInfo;
          this.logger.log(
            `==> CLIENT ID: ${client.id} [${email}] CONNECTED <==`,
            LOGGER_CONTEXTS.WEBSOCKET,
          );

          // CASE: Authentication has failed
        } catch (err) {
          this.logger.error(err.message, LOGGER_CONTEXTS.WEBSOCKET);
          client.emit(SOCKET_EVENT_NAME.ERROR, err.message);
          client.disconnect();
        }
      },
    );
  }

  // #=======================#
  // # ==> DISCONNECTION <== #
  // #=======================#
  handleDisconnect(client: ISocket) {
    client.disconnect();
    this.logger.warn(
      `==> CLIENT DISCONNECTED [${client.id}] <==`,
      LOGGER_CONTEXTS.WEBSOCKET,
    );
  }

  // #=======================#
  // # ==> MESSAGE EVENT <== #
  // #=======================#
  @SubscribeMessage(SOCKET_EVENT_NAME.MESSAGE)
  getMessage(
    @ConnectedSocket() client: ISocket,
    @MessageBody() body: MessageBodyDto,
  ): void {
    client.emit(`res-${SOCKET_EVENT_NAME.MESSAGE}`, body);
    console.log('BODY =', body);
    // JSON.parse('{');
  }

  // #=========================#
  // # ==> JOIN ROOM EVENT <== #
  // #=========================#
  @SubscribeMessage(SOCKET_EVENT_NAME.JOIN_ROOM)
  async joinRoom(
    @ConnectedSocket() client: ISocket,
    @MessageBody() body: JoinRoomBodyDto,
  ) {
    await client.join(body.roomName);
    return true;
  }

  // #==========================#
  // # ==> LEAVE ROOM EVENT <== #
  // #==========================#
  @SubscribeMessage(SOCKET_EVENT_NAME.LEAVE_ROOM)
  async leaveRoom(client: ISocket, roomName: string) {
    await client.leave(roomName);
    return true;
  }
}
