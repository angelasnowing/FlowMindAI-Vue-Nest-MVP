import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskQueryDto } from "./dto/task-query.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TasksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async findAll(query: TaskQueryDto) {
    const user = await this.users.getOrCreateCurrentUser();
    const where = {
      goal: { userId: user.id },
      ...(query.goalId && { goalId: query.goalId }),
      ...(query.status && { status: query.status }),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        where,
        orderBy: [{ goalId: "asc" }, { sortOrder: "asc" }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.task.count({ where }),
    ]);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(id: number) {
    const user = await this.users.getOrCreateCurrentUser();
    const task = await this.prisma.task.findFirst({
      where: { id, goal: { userId: user.id } },
    });
    if (!task) throw new NotFoundException("任务不存在");
    return task;
  }

  async create(dto: CreateTaskDto) {
    const user = await this.users.getOrCreateCurrentUser();
    const goal = await this.prisma.goal.findFirst({
      where: { id: dto.goalId, userId: user.id },
    });
    if (!goal) throw new NotFoundException("目标不存在");
    return this.prisma.task.create({
      data: { ...dto, title: dto.title.trim(), sortOrder: dto.sortOrder ?? 0 },
    });
  }

  async update(id: number, dto: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.$transaction([
      this.prisma.focusRecord.updateMany({
        where: { taskId: id },
        data: { taskId: null },
      }),
      this.prisma.task.delete({ where: { id } }),
    ]);
    return { id, deleted: true };
  }
}
