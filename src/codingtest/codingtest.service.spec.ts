import { Test, TestingModule } from '@nestjs/testing';
import { CodingtestService } from './codingtest.service';

describe('CodingtestService', () => {
  let service: CodingtestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CodingtestService],
    }).compile();

    service = module.get<CodingtestService>(CodingtestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
