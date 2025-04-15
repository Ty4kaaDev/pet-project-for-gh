import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginUserDTO, RegisterUserDTO } from './dto/user';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Post('/register')
    async register(
        @Body() body: RegisterUserDTO 
    ) {
        return await this.appService.register(body);
    }

    @Post('/login')
    async login(
        @Body() body: LoginUserDTO
    ) {
        return await this.appService.login(body)
    }
}
