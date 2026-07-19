import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  await db.focusRecord.deleteMany();
  await db.task.deleteMany();
  await db.goal.deleteMany();
  await db.flowProfile.deleteMany();
  await db.user.deleteMany();
  const u = await db.user.create({
    data: { nickname: "Sherry", careerStage: "成长型开发者" },
  });
  const g = await db.goal.create({
    data: {
      userId: u.id,
      title: "成为 NestJS 开发工程师",
      description: "系统掌握 NestJS，并完成一个可展示的全栈项目",
    },
  });
  await db.task.createMany({
    data: [
      {
        goalId: g.id,
        title: "完成 NestJS 环境搭建",
        estimatedTime: 65,
        sortOrder: 1,
      },
      {
        goalId: g.id,
        title: "创建用户模块（User Module）",
        estimatedTime: 60,
        sortOrder: 2,
      },
      {
        goalId: g.id,
        title: "编写第一个接口并测试",
        estimatedTime: 45,
        sortOrder: 3,
      },
    ],
  });
  await db.flowProfile.create({
    data: {
      userId: u.id,
      type: "深度成长型",
      bestTime: "9-12点",
      strength: "长时间专注能力强",
      weakness: "初始启动时间较长",
      suggestion: "将大目标拆解为更小的可执行任务，每次保持至少 2 个心流时段。",
    },
  });
}
main().finally(() => db.$disconnect());
