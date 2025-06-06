import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
