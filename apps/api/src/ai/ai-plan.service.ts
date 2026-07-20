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
    currentState: string;
    careerStage?: string | null;
  }): Promise<GeneratedTaskPlan> {
    if (!this.config.get<string>("OPENAI_API_KEY")) {
      return this.useFallbackOrThrow(
        input.goal,
        input.currentState,
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
              "你是心流学习成长规划助手。必须同时依据用户目标和当前状态制定计划：能量较低时降低启动难度、缩短单次任务；目标清晰时强调连续推进和验证；状态不错时安排更有挑战的深度任务。把目标拆成今天即可开始、动作明确、按执行顺序排列的任务。任务之间不能重复；预计时长使用整数分钟；总时长控制在 30 到 240 分钟。description 要说明本计划如何适配用户当前状态。",
          },
          {
            role: "user",
            content: [
              `目标：${input.goal}`,
              `当前状态：${input.currentState}`,
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
          input.currentState,
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
          input.currentState,
          new HttpException(message, HttpStatus.TOO_MANY_REQUESTS),
        );
      }
      if (error instanceof OpenAI.APIConnectionError) {
        return this.useFallbackOrThrow(
          input.goal,
          input.currentState,
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
        input.currentState,
        new ServiceUnavailableException("AI 任务生成暂时不可用，请稍后重试"),
      );
    }
  }

  private useFallbackOrThrow(
    goal: string,
    currentState: string,
    error: Error,
  ): GeneratedTaskPlan {
    const enabled =
      this.config.get<string>("AI_FALLBACK_ENABLED", "true").toLowerCase() !==
      "false";
    if (!enabled) throw error;

    console.warn(`AI plan fallback enabled: ${error.message}`);
    const shortGoal = goal.trim().slice(0, 60);
    const statePlan = {
      能量较低: {
        description: "先用低负担任务完成启动，再逐步进入学习节奏",
        times: [10, 10, 25, 10],
      },
      目标清晰: {
        description: "围绕明确目标持续推进，并用可验证成果确认进度",
        times: [15, 20, 45, 15],
      },
      状态不错: {
        description: "利用当前精力安排更具挑战性的深度学习和输出",
        times: [15, 20, 60, 20],
      },
    }[currentState] || {
      description: "按照当前节奏逐步推进目标",
      times: [15, 20, 45, 15],
    };
    return {
      source: "fallback",
      description: `当前状态为“${currentState}”：${statePlan.description}。围绕“${shortGoal}”生成以下成长计划。`,
      tasks: [
        {
          title: `明确“${shortGoal}”的完成标准`,
          estimatedTime: statePlan.times[0],
        },
        {
          title: `准备“${shortGoal}”所需的资料和环境`,
          estimatedTime: statePlan.times[1],
        },
        {
          title: `完成“${shortGoal}”的第一个可验证步骤`,
          estimatedTime: statePlan.times[2],
        },
        {
          title: "检查本次成果并记录下一步行动",
          estimatedTime: statePlan.times[3],
        },
      ],
    };
  }
}
