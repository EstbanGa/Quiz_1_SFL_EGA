import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Case, CaseDocument } from './entities/case.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Victim, VictimDocument } from 'src/victims/entities/victim.entity';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case.name) private caseModel: Model<CaseDocument>,
    @InjectModel(Victim.name) private victimModel: Model<VictimDocument>,
  ) {}

  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    const { victims: victimIds, ...rest } = createCaseDto;

    const validVictims = await this.victimModel.find({
      _id: { $in: victimIds },
    });

    if (validVictims.length !== victimIds.length) {
      throw new NotFoundException('One or more victim IDs are invalid');
    }

    const newCase = new this.caseModel({
      ...rest,
      victims: victimIds.map((id) => new Types.ObjectId(id)),
    });

    return newCase.save();
  }

  async findAll(): Promise<Case[]> {
    return this.caseModel.find().populate('victims').exec();
  }

  async findOne(id: string): Promise<Case> {
    const found = await this.caseModel.findById(id).populate('victims').exec();
    if (!found) throw new NotFoundException(`Case with ID ${id} not found`);
    return found;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const caseToUpdate = await this.caseModel.findById(id);
    if (!caseToUpdate) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    if (updateCaseDto.victims) {
      const validVictims = await this.victimModel.find({
        _id: { $in: updateCaseDto.victims },
      });

      if (validVictims.length !== updateCaseDto.victims.length) {
        throw new NotFoundException('One or more victim IDs are invalid');
      }

      // Assign ObjectId array directly to the model
      caseToUpdate.victims = updateCaseDto.victims.map(
        (id) => new Types.ObjectId(id),
      );
    }

    // Assign other fields
    if (updateCaseDto.detective !== undefined)
      caseToUpdate.detective = updateCaseDto.detective;
    if (updateCaseDto.weapon !== undefined)
      caseToUpdate.weapon = updateCaseDto.weapon;
    if (updateCaseDto.description !== undefined)
      caseToUpdate.description = updateCaseDto.description;
    if (updateCaseDto.suspect !== undefined)
      caseToUpdate.suspect = updateCaseDto.suspect;

    return caseToUpdate.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.caseModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException(`Case with ID ${id} not found`);
  }
}
