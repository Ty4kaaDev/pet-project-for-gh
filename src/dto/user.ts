import { IsString } from "class-validator";

export class RegisterUserDTO {
    @IsString()
    name: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string;

    @IsString()
    number: string

    @IsString()
    password: string
}

export class LoginUserDTO {
    @IsString()
    email: string;

    @IsString()
    password: string
}