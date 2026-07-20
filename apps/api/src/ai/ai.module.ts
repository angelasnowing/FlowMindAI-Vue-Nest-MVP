import { Module } from "@nestjs/common";
import { AiPlanService } from "./ai-plan.service";

@Module({ providers: [AiPlanService], exports: [AiPlanService] })
export class AiModule {}
