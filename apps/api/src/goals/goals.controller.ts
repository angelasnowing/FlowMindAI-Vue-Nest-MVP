import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { GoalQueryDto } from "./dto/goal-query.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";
import { GoalsService } from "./goals.service";

@Controller("goals")
export class GoalsController {
  constructor(private readonly goals: GoalsService) {}

  @Get() findAll(@Query() query: GoalQueryDto) {
    return this.goals.findAll(query);
  }
  @Get(":id") findOne(@Param("id", ParseIntPipe) id: number) {
    return this.goals.findOne(id);
  }
  @Post() create(@Body() dto: CreateGoalDto) {
    return this.goals.create(dto);
  }
  @Patch(":id") update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGoalDto,
  ) {
    return this.goals.update(id, dto);
  }
  @Delete(":id") remove(@Param("id", ParseIntPipe) id: number) {
    return this.goals.remove(id);
  }
}

@Controller("plans")
export class PlansController {
  constructor(private readonly goals: GoalsService) {}
  @Post() create(@Body() dto: CreatePlanDto) {
    return this.goals.createPlan(dto);
  }
}
