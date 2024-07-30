import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Professor } from './professor.entity';
import { Course } from './cources.entity';

@Entity()
export class ProfessorCourses {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Professor, (professor) => professor.professorCourses)
  @JoinColumn({ name: 'professor_id' })
  professor!: Professor;

  @ManyToOne(() => Course, (course) => course.professorCourses)
  @JoinColumn({ name: 'course_id' })
  course!: Course;
}
