import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCaseDto {
  @IsString()
  detective: string;

  @IsArray()
  @IsString({ each: true })
  victims: string[];

  @IsString()
  weapon: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  suspect?: string;
}
