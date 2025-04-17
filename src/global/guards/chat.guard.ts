import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ChatService } from "src/chat/chat.service";
import { UserRole } from "src/entities/user/user.entity";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly chatService: ChatService,
        private readonly userService: UserService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const client = context.switchToWs().getClient();
        let session = await this.chatService.getSession(client);

        let role = this.reflector.get<UserRole>('role', context.getHandler());
        if (!role) {
            role = UserRole.BANNED;
        }

        if (!session) {
            this.chatService.disconnect(client, 404, 'Session not found');
            return false
        }
        session.user = await this.userService.findOneUser(
            'id',
            session.user.id as number,
        );
        client['session'] = session;
        return true;
    }
}
