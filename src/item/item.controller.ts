import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { UserGuard, UserRequest } from 'src/global/guards/auth.guard';
import { ItemService } from './item.service';
import { CreateItemDTO, GetItemDTO } from 'src/dto/item';
import { SkipAuth } from 'src/global/decorators/skip.decorator';
import { GridFSBucketWriteStream } from 'typeorm';

@UseGuards(UserGuard)
@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Post('/create')
    async createItem(@Body() body: CreateItemDTO, @Req() request: UserRequest) {
        return await this.itemService.createItem(
            request.user,
            body.name,
            body.description,
            body.price,
        );
    }

    @Put('/:id')
    async updateItem(
        @Param('id') id: string,
        @Body() body: CreateItemDTO,
        @Req() request: UserRequest,
    ) {
        return await this.itemService.updateItem(
            request.user,
            parseInt(id),
            body.name,
            body.description,
            body.price,
        );
    }

    @Delete('/:id')
    async deleteItem(@Param('id') id: string, @Req() request: UserRequest) {
        return await this.itemService.deleteItem(request.user, parseInt(id));
    }

    @SkipAuth()
    @Get('/')
    async getItems(@Query() query: GetItemDTO) {
        return await this.itemService.getItem(query.key, query.value);
    }

    @SkipAuth()
    @Get('/:id')
    async getItemWithId(@Param('id') id: string) {
        return await this.itemService.getItem('id', id);
    }
}
