import { IsIn, IsString } from "class-validator";
import { CreateGoalDto } from "./create-goal.dto";

export class CreatePlanDto extends CreateGoalDto {
  @IsString()
  @IsIn(["能量较低", "目标清晰", "状态不错"])
  currentState!: string;
}
