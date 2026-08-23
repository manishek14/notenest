import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('notes')
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  // نام صاحب نوت - برای شخصی‌سازی پیامک تایید (#NAME#)
  @Column({ length: 100 })
  name: string;

  // شماره موبایل صاحب نوت - مقصد پیامک تایید (#PHONE#)
  @Index()
  @Column({ length: 15 })
  mobile: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
