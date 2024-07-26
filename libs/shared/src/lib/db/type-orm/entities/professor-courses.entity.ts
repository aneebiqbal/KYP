import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Professor } from './professor.entity';
import { Course } from './cources.entity';

@Entity()
export class ProfessorCourses {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Professor, (professor) => professor.professorCourses)
  professor!: Professor;

  @ManyToOne(() => Course, (course) => course.professorCourses)
  course!: Course;
}
