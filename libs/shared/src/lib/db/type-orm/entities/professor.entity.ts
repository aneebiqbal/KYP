import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Institute } from './institute.entity';
import { Course } from './cources.entity';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ length: 512 })
  image_url!: string;

  @Column({ length: 255 })
  department_name!: string;

  @ManyToOne(() => Institute, { onDelete: 'CASCADE' })
  institute!: Institute;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
