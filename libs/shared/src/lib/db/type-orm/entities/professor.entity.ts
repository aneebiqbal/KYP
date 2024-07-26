import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Institute } from './institute.entity';
import { ProfessorCourses } from './professor-courses.entity';
import { Rating } from './rating.entity';

@Entity()
export class Professor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  first_name!: string;

  @Column()
  last_name!: string;

  @Column({ nullable: true })
  image_url!: string;

  @Column({ nullable: true })
  department_name!: string;

  @ManyToOne(() => Institute, (institute) => institute.professors)
  institute!: Institute;

  @OneToMany(() => ProfessorCourses, (professorCourses) => professorCourses.professor)
  professorCourses!: ProfessorCourses[];

  @OneToMany(() => Rating, (rating) => rating.professor)
  ratings!: Rating[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at!: Date;
}
