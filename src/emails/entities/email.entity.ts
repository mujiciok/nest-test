import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  userId: number;

  @Column({ length: 320 })
  senderEmail: string;

  @Column({ length: 320 })
  receiverEmail: string;

  @Column({ length: 100 })
  subject: string;

  @Column('text', { nullable: true })
  content: string;

  @Column('boolean', { default: false })
  isRead: boolean;
}
