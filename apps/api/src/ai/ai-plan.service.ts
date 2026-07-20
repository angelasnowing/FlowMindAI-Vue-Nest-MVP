import {
  HttpException,
  HttpStatus,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

const taskPlanSchema = z.object({
  description: z.string().min(1).max(500),
  tasks: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        estimatedTime: z.number().int().min(5).max(240),
      }),
    )
    .min(3)
    .max(6),
});

export type GeneratedTaskPlan = z.infer<typeof taskPlanSchema> & {
  source: "ai" | "fallback";
};

@Injectable()
export class AiPlanService {
  private readonly client: OpenAI;
  private readonly model: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>("OPENAI_API_KEY");
    this.client = new OpenAI({
      apiKey: apiKey || "missing-api-key",
      baseURL: this.config.get<string>("OPENAI_BASE_URL") || undefined,
      timeout: this.config.get<number>("OPENAI_TIMEOUT_MS", 45_000),
      maxRetries: 1,
    });
    this.model = this.config.get<string>("OPENAI_MODEL", "gpt-5.6-sol");
  }

  async generateTaskPlan(input: {
    goal: string;
    mood?: string;
    careerStage?: string | null;
  }): Promise<GeneratedTaskPlan> {
    if (!this.config.get<string>("OPENAI_API_KEY")) {
      return this.useFallbackOrThrow(
        input.goal,
        new ServiceUnavailableException("大模型 API Key 尚未配置"),
      );
    }

    try {
      const response = await this.client.responses.parse({
        model: this.model,
        reasoning: { effort: "low" },
        input: [
          {
            role: "developer",
            content:
              "你是心流任务规划助手。把用户目标拆成今天即可开始、动作明确、按执行顺序排列的任务。任务之间不能重复；预计时长使用整数分钟；总时长控制在 30 到 240 分钟。只生成与目标直接相关的任务。",
          },
          {
            role: "user",
            content: [
              `目标：${input.goal}`,
              `当前状态：${input.mood || "未提供"}`,
              `职业阶段：${input.careerStage || "未提供"}`,
            ].join("\n"),
          },
        ],
        text: {
          format: zodTextFormat(taskPlanSchema, "flowmind_task_plan"),
          verbosity: "low",
        },
      });

      if (!response.output_parsed) {
        throw new Error("模型没有返回可解析的任务计划");
      }
      return { ...response.output_parsed, source: "ai" };
    } catch (error) {
      if (error instanceof OpenAI.AuthenticationError) {
        return this.useFallbackOrThrow(
          input.goal,
          new ServiceUnavailableException(
            "大模型 API Key 无效，请检查后端环境配置",
          ),
        );
      }
      if (error instanceof OpenAI.RateLimitError) {
        const message =
          error.code === "insufficient_quota"
            ? "大模型 API 额度不足，请检查 OpenAI 账户余额和项目额度"
            : "大模型请求过于频繁，请稍后重试";
        return this.useFallbackOrThrow(
          input.goal,
          new HttpException(message, HttpStatus.TOO_MANY_REQUESTS),
        );
      }
      if (error instanceof OpenAI.APIConnectionError) {
        return this.useFallbackOrThrow(
          input.goal,
          new ServiceUnavailableException("无法连接大模型服务，请检查后端网络"),
        );
      }
      if (error instanceof OpenAI.APIError) {
        console.error("OpenAI request failed", {
          status: error.status,
          code: error.code,
          requestId: error.requestID,
        });
      } else {
        console.error("OpenAI task plan parsing failed", error);
      }
      return this.useFallbackOrThrow(
        input.goal,
        new ServiceUnavailableException("AI 任务生成暂时不可用，请稍后重试"),
      );
    }
  }

  private useFallbackOrThrow(goal: string, error: Error): GeneratedTaskPlan {
    const enabled =
      this.config.get<string>("AI_FALLBACK_ENABLED", "true").toLowerCase() !==
      "false";
    if (!enabled) throw error;

    console.warn(`AI plan fallback enabled: ${error.message}`);
    const shortGoal = goal.trim().slice(0, 60);
    return {
      source: "fallback",
      description: `围绕“${shortGoal}”生成的临时启动计划（当前使用本地模板）`,
      tasks: [
        { title: `明确“${shortGoal}”的完成标准`, estimatedTime: 15 },
        { title: `准备“${shortGoal}”所需的资料和环境`, estimatedTime: 20 },
        { title: `完成“${shortGoal}”的第一个可验证步骤`, estimatedTime: 45 },
        { title: "检查本次成果并记录下一步行动", estimatedTime: 15 },
      ],
    };
  }
}
