import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Chat } from './chat.entity';

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn()
    from: User;

    @ManyToOne(() => User)
    @JoinColumn()
    to: User;

    @ManyToOne(() => Chat)
    @JoinColumn()
    chat: Chat;

    @Column()
    text: string

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createAt: Date

    @Column("text", { array: true, nullable: true })
    files: string[] | null;
}
