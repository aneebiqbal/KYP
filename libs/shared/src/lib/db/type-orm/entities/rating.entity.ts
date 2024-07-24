import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';
import { Professor } from './professor.entity';
import { Course } from './cources.entity';

@Entity()
export class Rating {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  student!: Student;

  @ManyToOne(() => Professor, { onDelete: 'CASCADE' })
  professor!: Professor;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  course!: Course;

  @Column({ type: 'int' })
  courseDifficulty: number = 0;

  @Column({ type: 'int' })
  clarity: number = 0;

  @Column({ type: 'int' })
  collaboration: number = 0;

  @Column({ type: 'int' })
  knowledgeable: number = 0;

  @Column({ type: 'int' })
  helpful: number = 0;

  @Column({ type: 'int' })
  textbookUse: number = 0;

  @Column({ type: 'int' })
  examDifficulty: number = 0;

  @Column({ type: 'int' })
  loveTeachingStyle: number = 0;

  @Column({ default: false })
  takeAgain: boolean = false;

  @Column({ default: false })
  mandatoryAttendance: boolean = false;

  @Column({ default: false })
  forCredit: boolean = false;

  @Column({ length: 255, nullable: true })
  gradeReceived!: string;

  @Column({ length: 512 })
  comment: string = '';

  @Column({ type: 'int' })
  upvotes: number = 0;

  @Column({ type: 'int' })
  downvotes: number = 0;

  @Column({ type: 'int' })
  flagged: number = 0;

  @Column('simple-array')
  tags: string[] = [];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
