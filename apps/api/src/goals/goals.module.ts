import { Module } from "@nestjs/common";
import { AiModule } from "../ai/ai.module";
import { UsersModule } from "../users/users.module";
import { GoalsController, PlansController } from "./goals.controller";
import { GoalsService } from "./goals.service";

@Module({
  imports: [UsersModule, AiModule],
  controllers: [GoalsController, PlansController],
  providers: [GoalsService],
})
export class GoalsModule {}
