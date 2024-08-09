import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ProfessorCourses } from './professor-courses.entity';
import { Rating } from './rating.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  course_code!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  @OneToMany(() => ProfessorCourses, (professorCourses) => professorCourses.course)
  professorCourses!: ProfessorCourses[];

  @OneToMany(() => Rating, (rating) => rating.course)
  ratings!: Rating[];
}
