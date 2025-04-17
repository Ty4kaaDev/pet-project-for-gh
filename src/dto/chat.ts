import { IsString, IsArray, IsOptional } from "class-validator";

export class MessageDTO {
    @IsString()
    text: string;

    @IsArray()
    @IsOptional()
    files?: Array<string>;
}

export class SendMessageDTO extends MessageDTO {
    @IsString()
    recipientId: number;

    @IsString()
    chatId: number;
}

