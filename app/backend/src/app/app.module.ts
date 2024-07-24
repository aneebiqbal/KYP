import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { TypeOrmCustomModule } from '@kyp/db';

@Module({
  imports: [TypeOrmCustomModule,StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
