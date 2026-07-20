import { Injectable, NotFoundException } from "@nestjs/common";
import { AiPlanService } from "../ai/ai-plan.service";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { CreatePlanDto } from "./dto/create-plan.dto";
import { GoalQueryDto } from "./dto/goal-query.dto";
import { UpdateGoalDto } from "./dto/update-goal.dto";

@Injectable()
export class GoalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly aiPlan: AiPlanService,
  ) {}

  async findAll(query: GoalQueryDto) {
    const user = await this.users.getOrCreateCurrentUser();
    const where = {
      userId: user.id,
      ...(query.status && { status: query.status }),
    };
    const skip = (query.page - 1) * query.pageSize;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.goal.findMany({
        where,
        include: { tasks: { orderBy: { sortOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: query.pageSize,
      }),
      this.prisma.goal.count({ where }),
    ]);
    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(id: number) {
    const user = await this.users.getOrCreateCurrentUser();
    const goal = await this.prisma.goal.findFirst({
      where: { id, userId: user.id },
      include: { tasks: { orderBy: { sortOrder: "asc" } } },
    });
    if (!goal) throw new NotFoundException("目标不存在");
    return goal;
  }

  async create(dto: CreateGoalDto) {
    const user = await this.users.getOrCreateCurrentUser();
    return this.prisma.goal.create({
      data: {
        userId: user.id,
        title: dto.title.trim(),
        description: dto.description?.trim() || "",
      },
      include: { tasks: true },
    });
  }

  async createPlan(dto: CreatePlanDto) {
    const user = await this.users.getOrCreateCurrentUser();
    const plan = await this.aiPlan.generateTaskPlan({
      goal: dto.title.trim(),
      currentState: dto.currentState,
      careerStage: user.careerStage,
    });

    const goal = await this.prisma.$transaction(async (tx) => {
      const created = await tx.goal.create({
        data: {
          userId: user.id,
          title: dto.title.trim(),
          currentState: dto.currentState,
          description: dto.description?.trim() || plan.description,
        },
      });
      await tx.task.createMany({
        data: plan.tasks.map((task, index) => ({
          goalId: created.id,
          ...task,
          sortOrder: index + 1,
        })),
      });
      return created;
    });
    const result = await this.findOne(goal.id);
    return { ...result, generationSource: plan.source };
  }

  async update(id: number, dto: UpdateGoalDto) {
    await this.findOne(id);
    return this.prisma.goal.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.$transaction(async (tx) => {
      const tasks = await tx.task.findMany({
        where: { goalId: id },
        select: { id: true },
      });
      const taskIds = tasks.map((task) => task.id);
      if (taskIds.length) {
        await tx.focusRecord.updateMany({
          where: { taskId: { in: taskIds } },
          data: { taskId: null },
        });
      }
      await tx.task.deleteMany({ where: { goalId: id } });
      await tx.goal.delete({ where: { id } });
    });
    return { id, deleted: true };
  }
}
