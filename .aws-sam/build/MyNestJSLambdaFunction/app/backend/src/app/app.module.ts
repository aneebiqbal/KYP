import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { TypeOrmCustomModule } from '@kyp/db';
import { AuthModule } from './auth/auth.module';
import { ProfessorModule } from './professor/professor.module';
import { RatingModule } from './rating/rating.module';

@Module({
  imports: [TypeOrmCustomModule,StudentModule, AuthModule, ProfessorModule, StudentModule, RatingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}