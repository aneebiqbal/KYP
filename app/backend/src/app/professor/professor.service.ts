import { Course } from './../../../../../libs/shared/src/lib/db/type-orm/entities/cources.entity';
import { Professor, Rating, Student} from '@kyp/db';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnyBulkWriteOperation, Repository } from 'typeorm';
import { getPaginated, PaginatedResult } from '../utils/getPaginated';
import { last } from 'rxjs';



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

interface recommentedprofessor{
  id:number;
  name: string;
  image_url: string; 
  department_name: string;
  institute_name: string;
  ratings:number
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
    // @InjectRepository(ProfessorCourses)
    // private readonly professorCourses: Repository<ProfessorCourses>,
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

      // if(name.split(" ").length>=2){

      //   let first_name=name.split(" ")[0];
      //   let last_name = name.split(" ")[1];
      //   console.log("first: ",first_name);
      //   console.log("last: ",last_name);

      //   query.andWhere(
      //     'professor.first_name ILIKE :first_name AND professor.last_name ILIKE :last_name',
      //     { first_name: first_name ,last_name: last_name }
      //   );
      // }

    if (name) {
      if(searchBy === 'name'){
          query.andWhere(
            'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
            { name: `%${name}%` }
          );
      }else if(searchBy === 'institute'){
        query.andWhere(
          `institute.name ILIKE :name`,
          { name:  `%${name}%` }
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
      const overallRatings =
        totalRatings > 0
          ? professor.ratings.reduce(
              (acc, rating) =>
                acc + rating.overallRating,
              0
            ) / totalRatings
          : 0;

      const is_saved = savedProfessors.includes(professor.id);

      return {
        ...professor,
        overallRating: parseFloat(overallRatings.toFixed(2)),
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


  async getRecommendations( name?: string,searchBy?: string,studentId?:number): Promise<any> {
    
    console.log("name: ",name);
    console.log("searchBy: ",searchBy )
    const query = this.professorRepository
    .createQueryBuilder('professor')
    .leftJoinAndSelect('professor.institute', 'institute')
    .leftJoinAndSelect('professor.ratings', 'ratings')

  if (name) {
    if(searchBy === 'name'){
        query.andWhere(
          'professor.first_name ILIKE :name OR professor.last_name ILIKE :name',
          { name: `%${name}%` }
        );
    }else if(searchBy === 'institute'){
      query.andWhere(
        `institute.name ILIKE :name`,
        { name:  `%${name}%` }
      );
    }
  }
  query.take(4)
  const professors = await query.getMany();
  // console.log("Recommended Professsor: ",professors)
  if ( professors.length === 0) {
    throw new NotFoundException(
      `No professors found by ${searchBy}`
    );
  }
  let recommendedProfessors=professors.map((professor) => {
    const response: recommentedprofessor = {
      id: professor.id,
      name: `${professor.first_name} ${professor.last_name}`,
      image_url: professor.image_url,
      department_name: professor.department_name,
      institute_name: professor.institute.name,
      ratings: (professor.ratings.length > 0)
        ? professor.ratings.reduce(
            (acc, rating) =>
              acc + rating.overallRating,
            0
          ) / professor.ratings.length
        : 0
    
    };
    return response;
  });
  console.log("recommended Professor: ",recommendedProfessors)
  return recommendedProfessors;
  // return recommendedProfessors;
    // return getPaginated(professors.map((professor) => {
    //   const response: recommentedprofessor = {
    //     id: professor.id,
    //     name: `${professor.first_name} ${professor.last_name}`,
    //     image_url: professor.image_url,
    //     department_name: professor.department_name,
    //     institute_name: professor.institute.name,
    //   };
    //   return response;
    // }), 1, limit);
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

  async getProfessorCourse(professorId: number): Promise<any> {
    try {
      let courses=[]
      // let tags=[];

      const professor = await this.professorRepository.findOne({
        where: { id: professorId },
        relations: ['institute'],
      });

      if (!professor) {
        return new NotFoundException(`Professor with ID ${professorId} not found`);
      }
      const query = this.professorRepository
      .createQueryBuilder('professor')
      .innerJoinAndSelect('professor.professorCourses', 'professorCourses')
      .innerJoinAndSelect('professorCourses.course', 'course')
      // .innerJoinAndSelect('course.ratings', 'rating')
      .where('professorCourses.professor_id = :professorId', { professorId })
      // .andWhere('rating.professor_id = :professorId', { professorId })

      const professorCourses = await query.getMany();
      console.log("courses:",professorCourses)

      if (professorCourses?.length > 0) {
       professorCourses[0].professorCourses.flatMap((course)=>{
        courses.push({
          course_id:course.course.id,
          course_code:course.course.course_code,
         })
        //    course.course.ratings.flatMap(((rating)=>{
        //        tags.push(rating.tags)
        // }))
        })
      }
      // let uniqueTags = [...new Set(tags.flat().filter(tag => tag !== null))];
      return {
        id:professor.id,
        first_name:professor.first_name,
        last_name:professor.last_name,
        image_url:professor.image_url,
        department_name:professor.department_name,
        institute:professor.institute.name,
        courses,
        // tags:uniqueTags
      }
    }catch (error) {
      console.error(error);
    return new Error('An error occurred while retrieving professor courses');
    }
  }

  async getSavedProfessor(StudentId:any,professorId: number): Promise<any> {
    try {
      let saved=false;
      console.log("professorid: ",professorId)
      const student = await this.studentRepository.findOne({
        where: { id: StudentId },
      });
      console.log("student: ",student)
      console.log("student saved professor : ",student.saved_professors)
      if(student.saved_professors){
      student.saved_professors.map((professor) => {
        // console.log("professor: ",professor)
        if(professor== professorId) {
          saved=true;
        }
      })
    } 
      return {saved}

    }catch (error) {
      console.error(error);
    return new Error('An error occurred while retrieving professor details');
    }
  }

  async getProfessorCourseDetails(StudentId:any,professorId: number,page = 1,limit = 3,courseCode?: string): Promise<PaginatedResult<any>> {
    let Course=[];
    console.log("course id: ",courseCode);
    console.log("page number: ",page);
    console.log("page limit: ",limit)
    console.log("professor id: ",professorId);
    const query = this.professorRepository
    .createQueryBuilder('professor')
    .innerJoinAndSelect('professor.professorCourses', 'professorCourses')
    .innerJoinAndSelect('professorCourses.course', 'course')
    .innerJoinAndSelect('course.ratings', 'rating') 
    .leftJoinAndSelect('rating.reactRatings','reactRatings') 
    .leftJoinAndSelect('reactRatings.student','student')
    .where('professorCourses.professor_id = :professorId', { professorId })
    .andWhere('rating.professor_id = :professorId', { professorId })
 
 if (courseCode) {
   query.andWhere('course.course_code = :courseCode', { courseCode });
 }

   const professorCourses = await query.getMany();

   if (professorCourses.length > 0) {
    Course = await Promise.all(
    professorCourses[0].professorCourses.map(async (course,index) => {
  
      if (!course || !course.course || !course.course.ratings || course.course.ratings.length === 0) {
        console.log("No ratings found for course:", course.course.course_code);
        return []; 
      }

      return Promise.all(
        course.course.ratings.map(async (rating) => {
          const id = rating.id;
  
          const query = this.ratingRepository.createQueryBuilder('ratings')
            .innerJoinAndSelect('ratings.student', 'student')
            .where('ratings.id = :id', { id });
  
          const commentedStudent = await query.getMany();
  
          if (!commentedStudent || commentedStudent.length === 0) {
            console.log("No commented student found for rating id: ", id);
          }
  
          let upVotes = 0;
          let downVotes = 0;
          let reported = 0;
          let ReactRatings = { upvote: false, downvote: false, reported: false };

          rating.reactRatings.forEach((reactRating) => {
            if (reactRating.student.id === StudentId) {
              ReactRatings.upvote = reactRating.upvote;
              ReactRatings.downvote = reactRating.downvote;
              ReactRatings.reported = reactRating.reported;
            }
            if (reactRating.upvote) upVotes++;
            if (reactRating.downvote) downVotes++;
            if (reactRating.reported) reported++;
          });
          return {
            course_name: course.course.course_code,
            id: rating.id,
            student_id:commentedStudent.length > 0 && commentedStudent[0].student.id,
            student_image_url: commentedStudent.length > 0 ? commentedStudent[0].student.image_url : null,
            student_name:commentedStudent.length > 0 ? commentedStudent[0].student.first_name +" " + commentedStudent[0].student.last_name : null,
            tags: rating.tags,
            created_at: rating.created_at,
            comment: rating.comment,
            for_credit: rating.for_credit,
            textbook_use:rating.textbook_use,
            upVotes,
            downVotes,
            reports: reported,
            attendance: rating.mandatory_attendance,
            rating:rating.overallRating,
            reactRatings: ReactRatings,
          };
        })
      );
    })
  );
  
  Course = Course.flatMap(course => course);
}
if(StudentId){
  const sortedData = Course.sort((a, b) => (a.student_id === StudentId ? -1 : 1));
  Course=sortedData
}


    return getPaginated(Course.map((course) => {
      return course; 
    }), Number(page), Number(limit))    
  }

  async getProfessorDetails(StudentId:any,professorId: number): Promise<any> {
    try {
      console.log("in detail api ",StudentId)
      let courses=[];
      let saved=false;
      const totalRatings = {
        course_difficulty: 0,
        clarity: 0,
        collaboration: 0,
        knowledgeable: 0,
        exam_difficulty: 0,
        love_teaching_style: 0,
      };
  
      const starCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      const tagCounts = new Map<string, number>();

      const professor = await this.professorRepository.findOne({
        where: { id: professorId },
        relations: ['institute', 'ratings'],
      });

      if (!professor) {
        return new NotFoundException(`Professor with ID ${professorId} not found`);
      }
      if(StudentId) {
        const student = await this.studentRepository.findOne({
          where: { id: StudentId },
        });
        if(student.saved_professors){
        student.saved_professors.map((professor) => {
          if(professor== professorId) {
            saved=true;
          }
        })
      } 
      }

      const query = this.professorRepository
      .createQueryBuilder('professor')
      .innerJoinAndSelect('professor.professorCourses', 'professorCourses')
      .innerJoinAndSelect('professorCourses.course', 'course')
      // .innerJoinAndSelect('course.ratings', 'rating')
      .where('professorCourses.professor_id = :professorId', { professorId })
      // .andWhere('rating.professor_id = :professorId', { professorId })

      const professorCourses = await query.getMany();
      console.log("courses:",professorCourses)

      if (professorCourses?.length > 0) {
       professorCourses[0].professorCourses.flatMap((course,index)=>{
         courses.push({
          label: course.course.course_code,
          value: index
        })
        })
      }
      const ratings = professor.ratings;
      const ProfessortotalRatings = ratings.length;
      const overallRating =
      ProfessortotalRatings > 0
          ? professor.ratings.reduce(
              (acc, rating) =>
                acc + rating.overallRating,
              0
            ) / ProfessortotalRatings
          : 0;

      if (ratings.length === 0) {
        let responses = {
          professor: {
            id: professor.id,
            first_name: professor.first_name,
            last_name: professor.last_name,
            image_url: professor.image_url,
            department_name: professor.department_name,
            institute_name: professor.institute.name,
            overallRating,
            star_distribution: starCounts,
            criteria_averages:totalRatings,
            top_tags: null,
          },
          courses,
          saved
        };
        return responses;
      }

      ratings.forEach((rating) => {
        const starRating = Math.round(
         rating.overallRating
        );
        
        if (starCounts[starRating] !== undefined) {
          starCounts[starRating]++;
        }
 
        Object.keys(totalRatings).forEach((key) => {
          totalRatings[key] += rating[key];
        });
      
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
          overallRating,
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
            // textbook_use:totalRatings.textbook_use,
            exam_difficulty: getCriteriaAverage(totalRatings.exam_difficulty),
            love_teaching_style: getCriteriaAverage(totalRatings.love_teaching_style),
          },
          top_tags: Array.from(tagCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([tag]) => tag),
        },
        courses,
        saved
      };
      return response;
  
    } catch (error) {
      console.error(error);
    return new Error('An error occurred while retrieving professor details');
    }
  }
}
