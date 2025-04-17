import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { Chat } from 'src/entities/chat/chat.entity';
import { Message } from 'src/entities/chat/message.entity';
import { SessionEntity } from 'src/entities/chat/session.model';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(SessionEntity) private readonly sessionRepository: Repository<SessionEntity>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
        @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    ) { }

    async getSession(client: Socket): Promise<SessionEntity | null> {
        const session = await this.sessionRepository.findOne({ where: { socketId: client.id } });

        if (!session) {
            this.disconnect(client, 404, 'Unknown session');
            return null;
        }

        return session;
    }

    async findOneChat(key: string, value: any ) {
        const [chat] = await this.sessionRepository.query(
            `SELECT * FROM "${this.sessionRepository.metadata.tableName}"
            WHERE ${key} = $1
            LIMIT 1
            `,
            [value],
        );

        return chat;
    }

    async getSessionByUser(user: User) {
        return await this.sessionRepository.findOne({ where: { user: user } });
    }

    async sendMessage(
        to: User,
        from: User,
        text: string,
        chat: Chat,
        files: Array<string> = [],
    ) {
        const message = await this.messageRepository.create({
            from: from,
            to: to,
            chat: chat,
            text: text,
            files: files,
        })

        chat.lastMesssageDate = new Date(Date.now())
        chat.lastMessage = text

        await this.chatRepository.update({ id: chat.id }, chat)

        return message;
    }

    disconnect(client: Socket, code: number, reason: string): null {
        try {
            client.emit('before-disconnect-status', {
                code,
                reason,
            });

            client.disconnect(true);
        } catch (error) {
            console.error('Error during client disconnect:', error);
        }


        this.sessionRepository
            .delete({ socketId: client.id })
            .then(() => {
                console.log(`Session for socketId ${client.id} removed successfully.`);
            })
            .catch((error) => {
                console.error('Error removing session from database:', error);
            });

        return null;
    }
}
