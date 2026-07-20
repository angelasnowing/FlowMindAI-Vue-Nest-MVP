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
import { CreateFocusRecordDto } from "./dto/create-focus-record.dto";
import { FocusRecordQueryDto } from "./dto/focus-record-query.dto";
import { UpdateFocusRecordDto } from "./dto/update-focus-record.dto";
import { FocusRecordsService } from "./focus-records.service";

@Controller("focus-records")
export class FocusRecordsController {
  constructor(private readonly records: FocusRecordsService) {}
  @Get() findAll(@Query() query: FocusRecordQueryDto) {
    return this.records.findAll(query);
  }
  @Get("statistics") statistics() {
    return this.records.statistics();
  }
  @Get(":id") findOne(@Param("id", ParseIntPipe) id: number) {
    return this.records.findOne(id);
  }
  @Post() create(@Body() dto: CreateFocusRecordDto) {
    return this.records.create(dto);
  }
  @Patch(":id") update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateFocusRecordDto,
  ) {
    return this.records.update(id, dto);
  }
  @Delete(":id") remove(@Param("id", ParseIntPipe) id: number) {
    return this.records.remove(id);
  }
}

@Controller("focus")
export class FocusCompatibilityController {
  constructor(private readonly records: FocusRecordsService) {}
  @Post() create(@Body() dto: CreateFocusRecordDto) {
    return this.records.create(dto);
  }
}
