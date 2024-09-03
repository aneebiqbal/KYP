import { Professor, Rating, Student,ProfessorCourses} from '@kyp/db';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getPaginated, PaginatedResult } from '../utils/getPaginated';


interface professor{
  id:number;
  name: string;
  image_url: string;
  department_name: string;
  institute_name: string;
  overall_rating: number;
  total_ratings: number;
  is_saved?: boolean;
  take_again: number;
  love_teaching_style: number;
}

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private readonly professorRepository: Repository<Professor>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
    @InjectRepository(ProfessorCourses)
    private readonly professorCourses: Repository<ProfessorCourses>,
  ) {}

  async searchProfessors(
    name?: string,
    searchBy?: string,
    sortField: 'first_name' | 'overall_rating' = 'first_name',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    studentId?:number,
    page = 1,
    limit = 1
  ): Promise<PaginatedResult<professor>> {
    const query = this.professorRepository
      .createQueryBuilder('professor')
      .leftJoinAndSelect('professor.institute', 'institute')
      .leftJoinAndSelect('professor.ratings', 'ratings')
      .leftJoinAndSelect('ratings.student', 'student')
      .where('ratings.deleted_at IS NULL');
    if (name) {
      if(searchBy === 'name'){
          query.andWhere(
            'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
            { name: `%${name}%` }
          );
      }else if(searchBy === 'institute'){
        query.andWhere(
          `institute.name ILIKE :name`,
          { name }
        );
      }
    }

    // if (institute_name) {
    //   query.andWhere('institute.name = :institute_name', { institute_name });
    // }

    if (sortField !== 'overall_rating') {
      query.orderBy(`professor.${sortField}`, sortOrder);
    }
    const professors = await query.getMany();
    if ( professors.length === 0) {
      throw new NotFoundException(
        `No professors found by ${searchBy}`
      );
    }

    let savedProfessors: number[] = [];
    if (studentId) {
      const student = await this.studentRepository.findOne({
        where: { id: studentId },
      });
      if (!student) {
        throw new NotFoundException(`Student with ID ${studentId} not found`);
      }
      savedProfessors = student ? student.saved_professors : [];
    }

    const professorsWithRatings = professors.map((professor) => {
      const totalRatings = professor.ratings.length;
      const overallRating =
        totalRatings > 0
          ? professor.ratings.reduce(
              (acc, rating) =>
                acc +
                (rating.course_difficulty +
                  rating.clarity +
                  rating.collaboration +
                  rating.knowledgeable +
                  rating.helpful +
                  rating.textbook_use +
                  rating.exam_difficulty +
                  rating.love_teaching_style) /
                  8,
              0
            ) / totalRatings
          : 0;

      const is_saved = savedProfessors.includes(professor.id);

      return {
        ...professor,
        overallRating: parseFloat(overallRating.toFixed(2)),
        totalRatings,
        is_saved,
      };
    });

    const sortedProfessors = professorsWithRatings.sort((a, b) => {
      if (sortField === 'overall_rating') {
        return sortOrder === 'DESC'
          ? a.overallRating - b.overallRating
          : b.overallRating - a.overallRating;
      }
      return 0;
    });

    return getPaginated(sortedProfessors.map((professor) => {
      const totalRatings = professor.ratings.length;
      const totalTakeAgain = professor.ratings.filter(rating => rating.take_again).length;
      const takeAgainPercentage = totalRatings > 0 ? (totalTakeAgain / totalRatings) * 100 : 0;
      const totalLoveTeachingStyle = professor.ratings.reduce((acc, rating) => acc + rating.love_teaching_style, 0);
      const loveTeachingStylePercentage = totalRatings > 0 ? (totalLoveTeachingStyle / (totalRatings * 5)) * 100 : 0;
      const response: professor = {
        id: professor.id,
        name: `${professor.first_name} ${professor.last_name}`,
        image_url: professor.image_url,
        department_name: professor.department_name,
        institute_name: professor.institute.name,
        overall_rating: professor.overallRating,
        take_again: parseFloat(takeAgainPercentage.toFixed(2)),
        love_teaching_style: parseFloat(loveTeachingStylePercentage.toFixed(2)),
        total_ratings: professor.totalRatings,
      };
      if (studentId) {
        response.is_saved = professor.is_saved;
      }
      return response;
    }), page, limit);
  }

  async addSavedProfessor(
    studentId: number,
    professorId: number
  ): Promise<void> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }
    const professor = await this.professorRepository.findOne({
      where: { id: professorId },
    });
    if (!professor) {
      throw new NotFoundException(`Professor with id ${professorId} not found`);
    }

    if (!student.saved_professors) {
      student.saved_professors = [];
    }
    if (student.saved_professors.includes(professorId)) {
      throw new BadRequestException(
        `Professor with ID ${professorId} is already in the saved professors list`
      );
    }
    if (!student.saved_professors.includes(professorId)) {
      student.saved_professors.push(professorId);
      await this.studentRepository.save(student);
    }
  }

  async removeSavedProfessor(
    studentId: number,
    professorId: number
  ): Promise<void> {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }
    const professor = await this.professorRepository.findOne({
      where: { id: professorId },
    });
    if (!professor) {
      throw new NotFoundException(`Professor with id ${professorId} not found`);
    }
    if (student) {
      if (!student.saved_professors) {
        student.saved_professors = [];
      }
      const savedProfessorIndex = student.saved_professors.indexOf(professorId);
      if (savedProfessorIndex === -1) {
        throw new NotFoundException(
          `Professor with id ${professorId} is not in the saved professors list`
        );
      }

      student.saved_professors = student.saved_professors.filter(
        (id) => id !== professorId
      );
      await this.studentRepository.save(student);
    }
  }

  async getProfessorDetails(professorId: number): Promise<any> {
    try {
      const professor = await this.professorRepository.findOne({
        where: { id: professorId },
        relations: ['institute', 'ratings'],
      });

      const course = await this.professorCourses.find({
        where: { professor: { id: professorId } },
      });
      console.log("couse: ",course);


  
      if (!professor) {
        throw new NotFoundException(`Professor with ID ${professorId} not found`);
      }
  
      const ratings = professor.ratings;
      if (ratings.length === 0) {
        throw new NotFoundException(`No ratings found for professor with ID ${professorId}`);
      }
  
      const totalRatings = {
        course_difficulty: 0,
        clarity: 0,
        collaboration: 0,
        knowledgeable: 0,
        helpful: 0,
        textbook_use: 0,
        exam_difficulty: 0,
        love_teaching_style: 0,
      };
  
      const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const tagCounts = new Map<string, number>();
  
      ratings.forEach((rating) => {
        Object.keys(totalRatings).forEach((key) => {
          totalRatings[key] += rating[key];
        });
  
        const starAverage = Math.round(
          Object.values(totalRatings).reduce((acc, val) => acc + val, 0) / 8
        );
        starCounts[starAverage]++;
  
        rating.tags?.forEach((tag) => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      });
  
      const ratingCount = ratings.length;
      const getPercentage = (count: number) => (count / ratingCount) * 100;
      const getCriteriaAverage = (total: number) => (total / ratingCount / 5) * 100;
  
      const response = {
        professor: {
          id: professor.id,
          first_name: professor.first_name,
          last_name: professor.last_name,
          image_url: professor.image_url,
          department_name: professor.department_name,
          institute_name: professor.institute.name,
          star_distribution: {
            one_star: getPercentage(starCounts[1]),
            two_star: getPercentage(starCounts[2]),
            three_star: getPercentage(starCounts[3]),
            four_star: getPercentage(starCounts[4]),
            five_star: getPercentage(starCounts[5]),
          },
          criteria_averages: {
            course_difficulty: getCriteriaAverage(totalRatings.course_difficulty),
            clarity: getCriteriaAverage(totalRatings.clarity),
            collaboration: getCriteriaAverage(totalRatings.collaboration),
            knowledgeable: getCriteriaAverage(totalRatings.knowledgeable),
            helpful: getCriteriaAverage(totalRatings.helpful),
            textbook_use: getCriteriaAverage(totalRatings.textbook_use),
            exam_difficulty: getCriteriaAverage(totalRatings.exam_difficulty),
            love_teaching_style: getCriteriaAverage(totalRatings.love_teaching_style),
          },
          top_tags: Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag]) => tag),
        },
      };
  
      return response;
  
    } catch (error) {
      
    }
  }
}
