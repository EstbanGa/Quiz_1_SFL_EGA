import { IsString, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class UpdateVictimDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Max(100)
  readonly age?: number;

  @IsOptional()
  @IsString()
  readonly family?: string;

  @IsOptional()
  @IsString()
  readonly murderMethod?: string;

  @IsOptional()
  @IsString()
  readonly caseId?: string;
}