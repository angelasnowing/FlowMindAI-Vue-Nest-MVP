import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateFocusRecordDto } from "./dto/create-focus-record.dto";
import { FocusRecordQueryDto } from "./dto/focus-record-query.dto";
import { UpdateFocusRecordDto } from "./dto/update-focus-record.dto";

@Injectable()
export class FocusRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async findAll(query: FocusRecordQueryDto) {
    const user = await this.users.getOrCreateCurrentUser();
    const where = {
      userId: user.id,
      ...(query.taskId && { taskId: query.taskId }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.focusRecord.findMany({
        where,
        include: { task: true },
        orderBy: { createdAt: "desc" },
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.focusRecord.count({ where }),
    ]);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(id: number) {
    const user = await this.users.getOrCreateCurrentUser();
    const record = await this.prisma.focusRecord.findFirst({
      where: { id, userId: user.id },
      include: { task: true },
    });
    if (!record) throw new NotFoundException("专注记录不存在");
    return record;
  }

  async create(dto: CreateFocusRecordDto) {
    const user = await this.users.getOrCreateCurrentUser();
    if (dto.taskId) {
      const task = await this.prisma.task.findFirst({
        where: { id: dto.taskId, goal: { userId: user.id } },
      });
      if (!task) throw new NotFoundException("任务不存在");
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.taskId) {
        await tx.task.update({
          where: { id: dto.taskId },
          data: { status: "DONE" },
        });
      }
      return tx.focusRecord.create({ data: { userId: user.id, ...dto } });
    });
  }

  async update(id: number, dto: UpdateFocusRecordDto) {
    await this.findOne(id);
    return this.prisma.focusRecord.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.focusRecord.delete({ where: { id } });
    return { id, deleted: true };
  }

  async statistics() {
    const user = await this.users.getOrCreateCurrentUser();
    const aggregate = await this.prisma.focusRecord.aggregate({
      where: { userId: user.id },
      _count: true,
      _sum: { duration: true, distractionCount: true },
      _avg: { duration: true, focusScore: true },
    });
    return {
      count: aggregate._count,
      totalDuration: aggregate._sum.duration ?? 0,
      totalDistractions: aggregate._sum.distractionCount ?? 0,
      averageDuration: aggregate._avg.duration ?? 0,
      averageFocusScore: aggregate._avg.focusScore ?? 0,
    };
  }
}
