import { Test, TestingModule } from '@nestjs/testing';
import { InstituteController } from './institite.controller';
import { InstituteService } from './institute.service';

describe('StudentController', () => {
  let controller: InstituteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstituteController],
      providers: [InstituteService],
    }).compile();

    controller = module.get<InstituteController>(InstituteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
