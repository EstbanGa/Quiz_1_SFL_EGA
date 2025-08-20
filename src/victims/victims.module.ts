import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Victim, VictimSchema } from './entities/victim.entity';
import { Case, CaseSchema } from '../cases/entities/case.entity';
import { VictimService } from './victims.service';
import { VictimController } from './victims.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Victim.name, schema: VictimSchema },
      { name: Case.name, schema: CaseSchema },
    ]),
  ],
  controllers: [VictimController],
  providers: [VictimService],
  exports: [MongooseModule, VictimService],
})
export class VictimModule {}