import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserGuard, UserRequest } from 'src/global/guards/auth.guard';

@UseGuards(UserGuard)
@Controller('user')
export class UserController {
    @Get()
    async get(@Req() req: UserRequest) {
        return req.user;
    }
}
