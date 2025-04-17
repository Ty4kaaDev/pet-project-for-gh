import { UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatGuard } from 'src/global/guards/chat.guard';
import { WsExceptionFilter } from './chat.filter';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { User } from 'src/entities/user/user.entity';
import { SendMessageDTO } from 'src/dto/chat';
import { UserService } from 'src/user/user.service';
import { Message } from 'src/entities/chat/message.entity';

export interface AuthorizedSocket extends Socket {
    session: ChatSocketSession;
}

export interface ChatSocketSession {
    id: string;
    instance: Socket;
    user: User;
}

@UseFilters(new WsExceptionFilter())
@UsePipes(new ValidationPipe())
@UseGuards(ChatGuard)
@WebSocketGateway(3388, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        preflightContinue: false,
    },
})
export class ChatGateway {
    @WebSocketServer() server: Server;
    constructor(
        private readonly chatService: ChatService,
        private readonly userService: UserService
    ) { }

    handleDisconnect(client: Socket) {
        this.chatService.disconnect(client, 410, 'Gone');
    }

    getSession(sessionId: string) {
        return this.server.sockets.sockets.get(sessionId);
    }

    @SubscribeMessage('sendMessage')
    async sendMessage(
        @ConnectedSocket() client: AuthorizedSocket,
        @MessageBody() body: SendMessageDTO,
    ) {
        const recipient = await this.userService.findOneUser('id', body.recipientId)
        if (!recipient) {
            this.chatService.disconnect(client, 404, 'User not found');
        }

        const chat = await this.chatService.findOneChat('id', body.chatId);
        if (!chat) {
            this.chatService.disconnect(client, 404, 'Chat not found');
        }
        if (
            chat?.customer != client.session.user &&
            chat?.performer != client.session.user
        ) {
            this.chatService.disconnect(client, 401, 'U are not in this chat');
        }
        const message = await this.chatService.sendMessage(
            client.session.user,
            recipient,
            body.text,
            chat,
            body.files,
        );
        client.emit('sendMessage', message);

        await this.sendRecipientMessage(recipient, message);
    }

    private async sendRecipientMessage(recipient: User, message: Message) {
        const recipientSession =
            await this.chatService.getSessionByUser(recipient);
        if (recipientSession) {
            const client = this.getSession(recipientSession.socketId);
            if (client) {
                client.emit('receiveMessage', message);
            }
        }
    }

}
