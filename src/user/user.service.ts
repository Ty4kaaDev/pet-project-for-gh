import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
    ) { }

    async createUser(name: string, lastName: string, email: string, number: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        if (await this.findOneUser('email', email)) {
            throw new HttpException('Email already exists', 400);
        }
        console.log(await this.findOneUser('number', number))
        if (await this.findOneUser('number', number)) {
            throw new HttpException('Number already exists', 400);
        }

        const [user] = await this.userRepository.query(
            `INSERT INTO "${this.userRepository.metadata.tableName}" 
            (name, last_name, email, number, password, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `,
            [name, lastName, email, number, hashedPassword, new Date().getMilliseconds()]
        );

        return user
    }

    async login(email: string, password: string) {
        const user = await this.userRepository.query(
            `SELECT * FROM "${this.userRepository.metadata.tableName}" WHERE email = $1 LIMIT 1`,
            [email]
        )
        if(!user) {
            throw new HttpException('User not found', 404);
        }
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if(!isPasswordValid) {
            throw new HttpException('Invalid password', 401);
        }
        return user
    }

    //TODO
    async authByJwt(user: User) {

    }

    async findOneUser(key: string, value: string) {
        const validColumns = this.userRepository.metadata.columns.map(col => col.propertyName);
        if (!validColumns.includes(key)) {
            throw new Error(`Invalid column name: ${key}`);
        }

        const [user] = await this.userRepository.query(
            `SELECT * FROM "${this.userRepository.metadata.tableName}" WHERE ${key} = $1 LIMIT 1`,
            [value]
        )

        return user;
    }
}
