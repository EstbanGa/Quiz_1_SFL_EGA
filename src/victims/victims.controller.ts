import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { VictimService } from './victims.service';
import { UpdateVictimDto } from './dto/update-victim.dto';
import { CreateVictimDto } from './dto/create-victim.dto';

@Controller('victims')
export class VictimController {
  constructor(private readonly victimService: VictimService) {}

  @Post()
  create(@Body() dto: CreateVictimDto) {
    return this.victimService.create(dto);
  }

  @Get()
  findAll() {
    return this.victimService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.victimService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVictimDto) {
    return this.victimService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.victimService.remove(id);
  }
}
