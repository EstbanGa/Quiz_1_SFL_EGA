import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Case, CaseDocument } from './entities/case.entity';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Victim, VictimDocument } from '../victims/entities/victim.entity';
import { VictimService } from '../victims/victims.service';

@Injectable()
export class CaseService {
  constructor(
    @InjectModel(Case.name) private caseModel: Model<CaseDocument>,
    @InjectModel(Victim.name) private victimModel: Model<VictimDocument>,
    @Inject(forwardRef(() => VictimService)) 
    private victimService: VictimService,
  ) {}

  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    const { victims: victimIds, ...rest } = createCaseDto;

    const validVictims = await this.victimModel.find({
      _id: { $in: victimIds.map(id => new Types.ObjectId(id)) },
    });

    if (validVictims.length !== victimIds.length) {
      throw new NotFoundException('One or more victim IDs are invalid');
    }

    // Crear el caso
    const newCase = new this.caseModel({
      ...rest,
      victims: victimIds.map((id) => new Types.ObjectId(id)),
    });

    const savedCase = await newCase.save();

    await this.updateVictimsWithCaseId(victimIds, (savedCase._id as Types.ObjectId).toString());

    return savedCase;
  }

  private async updateVictimsWithCaseId(victimIds: string[], caseId: string): Promise<void> {
    await this.victimModel.updateMany(
      { _id: { $in: victimIds.map(id => new Types.ObjectId(id)) } },
      { caseId: new Types.ObjectId(caseId) }
    );
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
      await this.handleVictimsUpdate(id, caseToUpdate.victims, updateCaseDto.victims);
    }

    // Actualizar otros campos
    if (updateCaseDto.detective !== undefined)
      caseToUpdate.detective = updateCaseDto.detective;
    if (updateCaseDto.weapon !== undefined)
      caseToUpdate.weapon = updateCaseDto.weapon;
    if (updateCaseDto.description !== undefined)
      caseToUpdate.description = updateCaseDto.description;
    if (updateCaseDto.suspect !== undefined)
      caseToUpdate.suspect = updateCaseDto.suspect;

    if (updateCaseDto.victims) {
      caseToUpdate.victims = updateCaseDto.victims.map(id => new Types.ObjectId(id));
    }

    return caseToUpdate.save();
  }

  private async handleVictimsUpdate(
    caseId: string, 
    currentVictims: Types.ObjectId[], 
    newVictimIds: string[]
  ): Promise<void> {
    const currentVictimIds = currentVictims.map(id => id.toString());
    
    const victimsToRemove = currentVictimIds.filter(id => !newVictimIds.includes(id));
    
    const victimsToAdd = newVictimIds.filter(id => !currentVictimIds.includes(id));

    if (newVictimIds.length > 0) {
      const validVictims = await this.victimModel.find({
        _id: { $in: newVictimIds.map(id => new Types.ObjectId(id)) },
      });

      if (validVictims.length !== newVictimIds.length) {
        throw new NotFoundException('One or more victim IDs are invalid');
      }
    }

    if (victimsToRemove.length > 0) {
      await this.victimModel.updateMany(
        { _id: { $in: victimsToRemove.map(id => new Types.ObjectId(id)) } },
        { $unset: { caseId: "" } }
      );
    }

    if (victimsToAdd.length > 0) {
      await this.updateVictimsWithCaseId(victimsToAdd, caseId);
    }
  }

  async remove(id: string): Promise<void> {
    const caseToDelete = await this.caseModel.findById(id);
    if (!caseToDelete) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    if (caseToDelete.victims && caseToDelete.victims.length > 0) {
      await this.victimModel.updateMany(
        { _id: { $in: caseToDelete.victims } },
        { $unset: { caseId: "" } }
      );
    }

    await this.caseModel.findByIdAndDelete(id);
  }
}