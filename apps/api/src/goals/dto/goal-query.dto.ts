import { IsIn, IsOptional } from "class-validator";
import { PaginationQueryDto } from "../../common/dto/pagination-query.dto";

export class GoalQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(["ACTIVE", "COMPLETED", "ARCHIVED"])
  status?: string;
}
