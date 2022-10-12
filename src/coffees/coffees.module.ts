import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS, OTHER_COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

class MockCoffeesService {}
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    // do something
    return ['Starbucks', 'Sulawesi Toraja'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
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
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
