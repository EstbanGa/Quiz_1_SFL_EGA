import { IsString, IsInt, IsOptional, IsPositive, Max } from 'class-validator';

export class CreateVictimDto {
  @IsString()
  name: string;

  @IsInt()
  @IsPositive()
  @Max(100)
  age: number;

  @IsString()
  family: string;

  @IsString()
  murderMethod: string;

  @IsOptional()
  @IsString()
  caseId?: string;
}
