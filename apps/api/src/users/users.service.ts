import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateCurrentUser() {
    const existing = await this.prisma.user.findFirst({
      orderBy: { id: "asc" },
    });
    if (existing) return existing;

    return this.prisma.user.create({
      data: { nickname: process.env.DEFAULT_USER_NICKNAME || "Sherry" },
    });
  }
}
