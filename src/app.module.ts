import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { GlobalModule } from './global/global.module';

@Module({
    imports: [
        GlobalModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService, UserService],
})
export class AppModule {}
