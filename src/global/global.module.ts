// app.module.ts
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';

const entities = [User]

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
    ],
    exports: [TypeOrmModule.forFeature(entities)],
})
export class GlobalModule { }
