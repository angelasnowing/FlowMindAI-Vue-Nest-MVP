import { IsOptional, IsString, MaxLength } from "class-validator";
import { CreateGoalDto } from "./create-goal.dto";

export class CreatePlanDto extends CreateGoalDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mood?: string;
}
