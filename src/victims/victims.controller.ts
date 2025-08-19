import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
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

  @Get('search')
  async getByNameAndFamily(
    @Query('name') name: string,
    @Query('family') family: string,
  ) {
    const victim = await this.victimService.findByNameAndFamily(name, family);
    if (!victim) {
      throw new NotFoundException(
        'Victim not found with given name and family',
      );
    }
    return victim;
  }

  @Patch('search')
  async patchByNameAndFamily(
    @Query('name') name: string,
    @Query('family') family: string,
    @Body() updateDto: UpdateVictimDto,
  ) {
    return this.victimService.updateByNameAndFamily(name, family, updateDto);
  }

  @Delete('search')
  async deleteByNameAndFamily(
    @Query('name') name: string,
    @Query('family') family: string,
  ) {
    await this.victimService.deleteByNameAndFamily(name, family);
    return { message: 'Victim deleted successfully' };
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
  async remove(@Param('id') id: string) {
    await this.victimService.remove(id);
    return { message: 'Victim deleted successfully' };
  }
}
