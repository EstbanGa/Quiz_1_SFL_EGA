import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Victim, VictimDocument } from './entities/victim.entity';
import { CreateVictimDto } from './dto/create-victim.dto';
import { UpdateVictimDto } from './dto/update-victim.dto';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class VictimService {
  constructor(
    @InjectModel(Victim.name) private victimModel: Model<VictimDocument>,
  ) {}

  async create(createDto: CreateVictimDto): Promise<Victim> {
    return new this.victimModel(createDto).save();
  }

  async findAll(): Promise<Victim[]> {
    return this.victimModel.find().exec();
  }

  async findOne(id: string): Promise<Victim> {
    const victim = await this.victimModel.findById(id).exec();
    if (!victim) {
      throw new NotFoundException(`Victim with ID ${id} not found`);
    }
    return victim;
  }

  async update(id: string, updateDto: UpdateVictimDto): Promise<Victim> {
    const updatedVictim = await this.victimModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
    if (!updatedVictim) {
      throw new NotFoundException(`Victim with ID ${id} not found`);
    }
    return updatedVictim;
  }

  async remove(id: string): Promise<Victim> {
    const deletedVictim = await this.victimModel.findByIdAndDelete(id).exec();
    if (!deletedVictim) {
      throw new NotFoundException(`Victim with ID ${id} not found`);
    }
    return deletedVictim;
  }

  async findByNameAndFamily(
    name: string,
    family: string,
  ): Promise<Victim | null> {
    return this.victimModel.findOne({ name, family }).exec();
  }

  async updateByNameAndFamily(
    name: string,
    family: string,
    updateDto: UpdateVictimDto,
  ): Promise<Victim> {
    const victim = await this.victimModel.findOneAndUpdate(
      { name, family },
      updateDto,
      { new: true },
    );
    if (!victim) {
      throw new NotFoundException(
        'Victim not found with given name and family',
      );
    }
    return victim;
  }

  async deleteByNameAndFamily(name: string, family: string): Promise<void> {
    const result = await this.victimModel.deleteOne({ name, family }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Victim not found with given name and family',
      );
    }
  }
}
