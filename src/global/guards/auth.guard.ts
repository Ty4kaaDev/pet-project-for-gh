import {
    CanActivate,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User, UserJwt, UserRole } from 'src/entities/user/user.entity';
import { UserService } from 'src/user/user.service';

export interface UserRequest extends Request {
    jwtPayload: UserJwt;
    user: User;
    token: string;
}

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private authService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const skipCheck = this.reflector.get<boolean>(
            'skipToken',
            context.getHandler(),
        );
        if (skipCheck === true) {
            return true;
        }

        let role = this.reflector.get<UserRole>('role', context.getHandler());
        if (!role) {
            role = UserRole.BANNED;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new HttpException('Missing token', HttpStatus.FORBIDDEN);
        }

        let payload: UserJwt;
        try {
            payload = await this.jwtService.verifyAsync(token);
        } catch {
            throw new HttpException('Invalid token', HttpStatus.FORBIDDEN);
        }

        const user = await this.authService.authByJwt(payload);
        if (user.role - role >= 0) {
            request['jwtPayload'] = payload;
            request['user'] = user;
            request['token'] = token;
        } else {
            throw new HttpException('Missing permission', HttpStatus.FORBIDDEN);
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
