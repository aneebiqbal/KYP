import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Institute } from './institute.entity';
import { ReactRating } from './react-rating.entity';
import { Rating } from './rating.entity';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  first_name!: string;

  @Column({ length: 255 })
  last_name!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ length: 512, nullable: true })
  image_url!: string;

  @Column('jsonb', { nullable: true, default: []  })
  saved_professors!: number[];

  @Column({ length: 255, nullable: true })
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Institute, (institute) => institute.students, { onDelete: 'CASCADE' })
  institute!: Institute;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ nullable: true })
  auth_pass!: string;

  @Column({ default: false })
  external_auth!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => Rating, (rating) => rating.student)
  ratings!: Rating[];

  @OneToMany(() => ReactRating, (reactRating) => reactRating.student)
  reactRatings!: ReactRating[];
}
