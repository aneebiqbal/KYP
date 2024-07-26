import { Module } from '@nestjs/common';
import { InstituteService } from './institute.service';
import { InstituteController } from './institite.controller';

@Module({
  imports: [],
  controllers: [InstituteController],
  providers: [InstituteService],
})
export class StudentModule { }
