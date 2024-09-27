import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, Check, JoinColumn } from 'typeorm';
import { Student } from './student.entity';
import { Professor } from './professor.entity';
import { ReactRating } from './react-rating.entity';
import { Course } from './cources.entity';

@Entity()
@Check(`"course_difficulty" BETWEEN 1 AND 5`)
@Check(`"clarity" BETWEEN 1 AND 5`)
@Check(`"collaboration" BETWEEN 1 AND 5`)
@Check(`"knowledgeable" BETWEEN 1 AND 5`)
@Check(`"helpful" BETWEEN 1 AND 5`)
// @Check(`"textbook_use" BETWEEN 1 AND 5`)
@Check(`"exam_difficulty" BETWEEN 1 AND 5`)
@Check(`"love_teaching_style" BETWEEN 1 AND 5`)

export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, (student) => student.ratings)
  @JoinColumn({ name: 'student_id' })
  student!: Student;

  @ManyToOne(() => Professor, (professor) => professor.ratings)
  @JoinColumn({ name: 'professor_id' })
  professor!: Professor;

  @ManyToOne(() => Course, (course) => course.ratings)
  @JoinColumn({ name: 'course_id' })
  course!: Course;

  @OneToMany(() => ReactRating, (reactRating) => reactRating.rating)
  reactRatings!: ReactRating[];

  @Column({ type: 'int', width: 1 })
  course_difficulty!: number;

  @Column({ type: 'int', width: 1 })
  clarity!: number;

  @Column({ type: 'int', width: 1 })
  collaboration!: number;

  @Column({ type: 'int', width: 1 })
  knowledgeable!: number;

  @Column({ type: 'int', width: 1 })
  overallRating!: number;

  @Column({ type: 'boolean',nullable: true})
  textbook_use!: boolean;

  @Column({ type: 'int', width: 1 })
  exam_difficulty!: number;

  @Column({ type: 'int', width: 1 })
  love_teaching_style!: number;

  @Column({ type: 'boolean', nullable: true })
  take_again!: boolean;

  @Column({ type: 'boolean', nullable: true })
  mandatory_attendance!: boolean;

  @Column({ type: 'boolean', nullable: true })
  for_credit!: boolean;

  @Column({ nullable: true })
  grade_received!: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  comment!: string;

  @Column('jsonb', { nullable: true })
  tags!: string[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
