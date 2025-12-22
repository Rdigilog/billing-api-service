import { Test, TestingModule } from '@nestjs/testing';
import { CardinformationService } from './cardinformation.service';

describe('CardinformationService', () => {
  let service: CardinformationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardinformationService],
    }).compile();

    service = module.get<CardinformationService>(CardinformationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
