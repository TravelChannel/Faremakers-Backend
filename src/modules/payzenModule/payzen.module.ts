import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PayzenController } from './payzen.controller';
import { PayzenService } from './payzen.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PayZenOrder } from './entities/payzen-order.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([PayZenOrder]),
    HttpModule.register({}), // Register HttpModule properly
  ],

  controllers: [PayzenController],
  providers: [PayzenService], // Provide the PayzenService
})
export class PayzenModule {}
