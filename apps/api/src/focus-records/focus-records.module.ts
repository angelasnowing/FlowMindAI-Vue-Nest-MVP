import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import {
  FocusCompatibilityController,
  FocusRecordsController,
} from "./focus-records.controller";
import { FocusRecordsService } from "./focus-records.service";

@Module({
  imports: [UsersModule],
  controllers: [FocusRecordsController, FocusCompatibilityController],
  providers: [FocusRecordsService],
})
export class FocusRecordsModule {}
