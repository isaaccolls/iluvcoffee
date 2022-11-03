import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  ASYNC_COFFEE_BRANDS,
  COFFEE_BRANDS,
  OTHER_COFFEE_BRANDS,
} from './coffees.constants';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import coffeesConfig from './config/coffees.config';

describe('CoffeesService', () => {
  let service: CoffeesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        { provide: getRepositoryToken(Flavor), useValue: {} }, // 👈
        { provide: getRepositoryToken(Coffee), useValue: {} }, // 👈
        // this should not be necessary
        { provide: COFFEE_BRANDS, useValue: [] },
        { provide: OTHER_COFFEE_BRANDS, useValue: [] },
        { provide: ASYNC_COFFEE_BRANDS, useValue: [] },
      ],
      // this should not be necessary
      imports: [ConfigModule.forFeature(coffeesConfig)],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
