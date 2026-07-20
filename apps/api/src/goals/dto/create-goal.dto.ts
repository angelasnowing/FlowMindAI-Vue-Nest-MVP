import { IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGoalDto {
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
