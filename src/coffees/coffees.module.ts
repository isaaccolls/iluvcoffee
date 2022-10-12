import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import {
  ASYNC_COFFEE_BRANDS,
  COFFEE_BRANDS,
  OTHER_COFFEE_BRANDS,
} from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Connection } from 'typeorm';
import coffeesConfig from './config/coffees.config';

class MockCoffeesService {}
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    // do something
    return ['starbucks', 'sulawesi toraja'];
  }
}

@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    {
      provide: 'CoffeesServiceUseValue',
      useValue: new MockCoffeesService(),
    },
    {
      provide: COFFEE_BRANDS,
      useValue: ['buddy brew', 'nescafe'],
    },
    {
      provide: OTHER_COFFEE_BRANDS,
      inject: [CoffeeBrandsFactory],
      useFactory: (coffeeBrandsFactory: CoffeeBrandsFactory) =>
        coffeeBrandsFactory.create(),
    },
    {
      provide: ASYNC_COFFEE_BRANDS,
      inject: [Connection],
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query('SELECT * ...');
        const coffeeBrands = await Promise.resolve([
          'el peñón',
          'fama de américa',
          'flor de patria',
        ]);
        return coffeeBrands;
      },
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
