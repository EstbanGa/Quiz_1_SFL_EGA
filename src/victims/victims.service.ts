import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Victim, VictimDocument } from './entities/victim.entity';
import { CreateVictimDto } from './dto/create-victim.dto';
import { UpdateVictimDto } from './dto/update-victim.dto';
import { Case, CaseDocument } from '../cases/entities/case.entity';

@Injectable()
export class VictimService {
  constructor(
    @InjectModel(Victim.name) private victimModel: Model<VictimDocument>,
    @InjectModel(Case.name) private caseModel: Model<CaseDocument>,
  ) {}

  async create(createDto: CreateVictimDto): Promise<Victim> {
    const { caseId, ...victimData } = createDto;
    
    // Crear la víctima
    const newVictim = new this.victimModel({
      ...victimData,
      caseId: caseId ? new Types.ObjectId(caseId) : undefined,
    });
    
    const savedVictim = await newVictim.save();

    if (caseId) {
      await this.updateCaseWithNewVictim(caseId, (savedVictim._id as Types.ObjectId).toString());
    }

    return savedVictim;
  }

  private async updateCaseWithNewVictim(caseId: string, victimId: string): Promise<void> {
    const caseExists = await this.caseModel.findById(caseId);
    if (!caseExists) {
      throw new NotFoundException(`Case with ID ${caseId} not found`);
    }

    await this.caseModel.findByIdAndUpdate(
      caseId,
      { 
        $addToSet: { victims: new Types.ObjectId(victimId) } 
      },
    );
  }

  async updateVictimsWithCaseId(victimIds: string[], caseId: string): Promise<void> {
    await this.victimModel.updateMany(
      { _id: { $in: victimIds.map(id => new Types.ObjectId(id)) } },
      { caseId: new Types.ObjectId(caseId) }
    );
  }

  async removeCaseIdFromVictims(victimIds: string[]): Promise<void> {
    await this.victimModel.updateMany(
      { _id: { $in: victimIds.map(id => new Types.ObjectId(id)) } },
      { $unset: { caseId: "" } }
    );
  }

  async findAll(): Promise<Victim[]> {
    return this.victimModel.find().populate('caseId').exec();
  }

  async findOne(id: string): Promise<Victim> {
    const victim = await this.victimModel.findById(id).populate('caseId').exec();
    if (!victim) {
      throw new NotFoundException(`Victim with ID ${id} not found`);
    }
    return victim;
  }

  async update(id: string, updateDto: UpdateVictimDto): Promise<Victim> {
    const updatedVictim = await this.victimModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .populate('caseId')
      .exec();
    if (!updatedVictim) {
      throw new NotFoundException(`Victim with ID ${id} not found`);
    }
    return updatedVictim;
  }

  async remove(id: string): Promise<void> {
    const victimToDelete = await this.victimModel.findById(id);
    if (!victimToDelete) {
      throw new NotFoundException(`Victim with ID ${id} not found`);
    }

    if (victimToDelete.caseId) {
      await this.caseModel.findByIdAndUpdate(
        victimToDelete.caseId,
        { $pull: { victims: new Types.ObjectId(id) } }
      );
    }

    await this.victimModel.findByIdAndDelete(id).exec();
  }

  async findByNameAndFamily(
    name: string,
    family: string,
  ): Promise<Victim | null> {
    return this.victimModel.findOne({ name, family }).populate('caseId').exec();
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
    ).populate('caseId').exec();
    
    if (!victim) {
      throw new NotFoundException(
        'Victim not found with given name and family',
      );
    }
    return victim;
  }

  async deleteByNameAndFamily(name: string, family: string): Promise<void> {
    const victimToDelete = await this.victimModel.findOne({ name, family });
    if (!victimToDelete) {
      throw new NotFoundException(
        'Victim not found with given name and family',
      );
    }

    if (victimToDelete.caseId) {
      await this.caseModel.findByIdAndUpdate(
        victimToDelete.caseId,
        { $pull: { victims: victimToDelete._id } }
      );
    }

    const result = await this.victimModel.deleteOne({ name, family }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        'Victim not found with given name and family',
      );
    }
  }
}