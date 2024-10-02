// src/entities/react-rating.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Rating } from './rating.entity';

@Entity()
export class ReactRating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, (student) => student.reactRatings)
  @JoinColumn({ name: 'student_id' })
  student!: Student;

  @ManyToOne(() => Rating, (rating) => rating.reactRatings)
  @JoinColumn({ name: 'rating_id' })
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