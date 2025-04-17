import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WsExceptionFilter {
    public catch(exception: HttpException, host: ArgumentsHost) {
        const client = host.switchToWs().getClient();
        this.handleError(client, exception);
    }

    public handleError(client: Socket, exception: HttpException | WsException) {
        try {
            client.emit('client-request-error', {
                code: exception['response']['statusCode'],
                reason: exception['response']['message'],
            });
        } catch {
            if (
                'message' in exception &&
                exception.message == 'Forbidden resource'
            ) {
                client.emit('client-request-error', {
                    code: 405,
                    reason: 'Missing permissions for this event',
                });
            } else {
                client.emit('client-request-error', {
                    code: 400,
                    reason: exception?.message,
                });
            }
        }
    }
}
