import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ifError } from 'assert';
import { Item } from 'src/entities/item/item.entity';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
    ) {}

    async createItem(
        author: User,
        name: string,
        description: string,
        price: number,
    ) {
        const [item] = await this.itemRepository.query(
            `INSERT INTO "${this.itemRepository.metadata.tableName}"
            (name, description, price, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [name, description, price, author.id],
        );

        return item;
    }

    async updateItem(
        user: User,
        id: number,
        name: string,
        description: string,
        price: number,
    ) {
        const item = await this.itemRepository.findOne({ where: { id: id } });
        if (!item) {
            throw new HttpException('Item not found', 404);
        }
        if (user.id != item.user.id) {
            throw new HttpException('Access denied', 403);
        }

        const [updatedItem] = await this.itemRepository.query(
            `UPDATE "${this.itemRepository.metadata.tableName}"
            SET name = $1, description = $2, price = $3
            WHERE id = $4
            RETURNING *
            `,
            [name, description, price, id],
        );

        return updatedItem;
    }

    async deleteItem(user: User, id: number) {
        const item = await this.itemRepository.findOne({ where: { id: id } });
        if (!item) {
            throw new HttpException('Item not found', 404);
        }
        if (user.id != item.user.id) {
            throw new HttpException('Access denied', 403);
        }
        await this.itemRepository.delete(id);
    }

    async getItem(key: string, value: any) {
        const [item] = await this.itemRepository.query(
            `SELECT * FROM "${this.itemRepository.metadata.tableName}"
            WHERE ${key} = $1`,
            [value],
        );

        return item;
    }
}
