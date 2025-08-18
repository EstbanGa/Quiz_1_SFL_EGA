import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Victim, VictimSchema } from './entities/victim.entity';
import { VictimService } from './victims.service';
import { VictimController } from './victims.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Victim.name, schema: VictimSchema }]),
  ],
  controllers: [VictimController],
  providers: [VictimService],
})
export class VictimModule {}
