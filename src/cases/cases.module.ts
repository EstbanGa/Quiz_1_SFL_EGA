import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Case, CaseSchema } from './entities/case.entity';
import { CaseService } from './cases.service';
import { CaseController } from './cases.controller';
import { VictimModule } from '../victims/victims.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Case.name, schema: CaseSchema }]),
    forwardRef(() => VictimModule), 
  ],
  controllers: [CaseController],
  providers: [CaseService],
  exports: [MongooseModule, CaseService], 
})
export class CaseModule {}