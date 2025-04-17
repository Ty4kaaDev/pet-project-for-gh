// app.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat/chat.entity';
import { Message } from 'src/entities/chat/message.entity';
import { SessionEntity } from 'src/entities/chat/session.model';
import { Item } from 'src/entities/item/item.entity';
import { User } from 'src/entities/user/user.entity';
import { UserService } from 'src/user/user.service';

const entities = [User, Item, Chat, Message, SessionEntity];

@Global()
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'admin',
            password: 'admin',
            database: 'testDB',
            entities: entities,
            synchronize: true,
        }),
        TypeOrmModule.forFeature(entities),
        ConfigModule.forRoot({
            envFilePath: './env/.env',
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                global: true,
                secret: configService.get<string>('JWT_TOKEN'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_EXPIRES'),
                },
            }),
            inject: [ConfigService],
        }),
    ],
    exports: [TypeOrmModule.forFeature(entities), ConfigModule, JwtModule],
})
export class GlobalModule {
    constructor() {
        console.log(process.env.JWT_TOKEN);
    }
}
