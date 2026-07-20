import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class CreateFocusRecordDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  taskId?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(86400)
  duration!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  focusScore!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  distractionCount!: number;
}
