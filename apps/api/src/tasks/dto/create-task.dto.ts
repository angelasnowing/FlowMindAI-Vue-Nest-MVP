import { Type } from "class-transformer";
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";

export class CreateTaskDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  goalId!: number;

  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1440)
  estimatedTime!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
