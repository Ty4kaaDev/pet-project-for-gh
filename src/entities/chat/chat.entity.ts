import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Item } from '../item/item.entity';

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Item)
    @JoinColumn()
    item: Item;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdat: Date;

    @Column({type: 'timestamp'})
    lastMesssageDate: Date

    @Column()
    lastMessage: string
}
