import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { Institute } from './institute.entity';
import { Professor } from './professor.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  first_name!: string;

  @Column({ length: 255 })
  last_name!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 512 })
  image_url!: string;

//   @OneToMany((professor) => Professor,)
//   @JoinTable()
  saved_professors!: Professor[];

  @Column({ length: 255 })
  password!: string;

  @Column({ default: false })
  isActive!: boolean;

  @ManyToOne(() => Institute, { onDelete: 'CASCADE' })
  institute!: Institute;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
