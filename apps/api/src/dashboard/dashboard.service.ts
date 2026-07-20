import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
  ) {}

  async getDashboard() {
    const user = await this.users.getOrCreateCurrentUser();
    return this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        goals: {
          orderBy: { createdAt: "desc" },
          include: { tasks: { orderBy: { sortOrder: "asc" } } },
        },
        profile: true,
        focusRecords: { orderBy: { createdAt: "desc" }, take: 50 },
      },
    });
  }
}
