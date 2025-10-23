import { Module } from '@nestjs/common';
import { TreatmentController } from './treatment.controller';
import { TreatmentService } from './treatment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Treatment } from 'src/entities/treatment.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Treatment])],
  controllers: [TreatmentController],
  providers: [TreatmentService]
})
export class TreatmentModule {}
