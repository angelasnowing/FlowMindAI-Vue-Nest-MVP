import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional, Min } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class TaskQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  goalId?: number;

  @IsOptional()
  @IsIn(["TODO", "IN_PROGRESS", "DONE"])
  status?: string;
}
