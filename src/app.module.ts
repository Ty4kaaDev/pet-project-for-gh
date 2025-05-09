import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { GlobalModule } from './global/global.module';
import { ItemModule } from './item/item.module';
import { ChatModule } from './chat/chat.module';

@Module({
    imports: [GlobalModule, UserModule, ItemModule, ChatModule],
    controllers: [AppController],
    providers: [AppService, UserService],
})
export class AppModule {}
