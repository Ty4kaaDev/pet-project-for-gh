import { IsNumber, IsString } from "class-validator";

export class CreateItemDTO {
    @IsString()
    name: string

    @IsString()
    description: string

    @IsNumber()
    price: number
}

export class GetItemDTO {
    @IsString()
    key: string

    @IsString()
    value: string
}