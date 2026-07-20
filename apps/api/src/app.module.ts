import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DashboardModule } from "./dashboard/dashboard.module";
import { FocusRecordsModule } from "./focus-records/focus-records.module";
import { GoalsModule } from "./goals/goals.module";
import { PrismaModule } from "./prisma/prisma.module";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DashboardModule,
    GoalsModule,
    TasksModule,
    FocusRecordsModule,
  ],
})
export class AppModule {}
