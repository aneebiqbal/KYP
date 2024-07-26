import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { TypeOrmCustomModule } from '@kyp/db';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmCustomModule,StudentModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
