import { HttpException, Injectable } from '@nestjs/common';
import { UserService } from './user/user.service';
import { LoginUserDTO, RegisterUserDTO } from './dto/user';

@Injectable()
export class AppService {
    constructor(private readonly userService: UserService) {}

    async register(body: RegisterUserDTO) {
        return await this.userService.createUser(body.name, body.lastName, body.email, body.number, body.password);
    }

    async login(body: LoginUserDTO){
        const user = await this.userService.findOneUser('email', body.email)
        if(!user){
            throw new HttpException('User not found', 404);
        }
        return await this.userService.login(body.email, body.password)
    }
}
