import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  author: string;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @Column({ name: 'file_url', nullable: true })
  fileUrl: string;
}