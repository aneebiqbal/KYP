// src/entities/react-rating.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { Rating } from './rating.entity';

@Entity()
export class ReactRating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, (student) => student.reactRatings)
  student!: Student;

  @ManyToOne(() => Rating, (rating) => rating.reactRatings)
  rating!: Rating;

  @Column({ default: false })
  upvote!: boolean;

  @Column({ default: false })
  downvote!: boolean;

  @Column({ default: false })
  reported!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
