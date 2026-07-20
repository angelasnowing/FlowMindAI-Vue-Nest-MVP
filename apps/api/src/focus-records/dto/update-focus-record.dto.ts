import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class UpdateFocusRecordDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(86400)
  duration?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  focusScore?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  distractionCount?: number;
}
