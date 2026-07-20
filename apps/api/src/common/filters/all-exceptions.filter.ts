import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";

interface HttpRequest {
  url: string;
}

interface HttpResponse {
  status(code: number): HttpResponse;
  json(body: unknown): void;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<HttpResponse>();
    const request = host.switchToHttp().getRequest<HttpRequest>();
    const normalized = this.normalize(exception);

    response.status(normalized.statusCode).json({
      success: false,
      statusCode: normalized.statusCode,
      error: normalized.error,
      message: normalized.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private normalize(exception: unknown) {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const body = exception.getResponse();
      const payload = typeof body === "string" ? { message: body } : body;
      const details = payload as {
        message?: string | string[];
        error?: string;
      };
      return {
        statusCode,
        error: details.error ?? exception.name,
        message: details.message ?? exception.message,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === "P2025") {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          error: "Not Found",
          message: "请求的数据不存在",
        };
      }
      if (exception.code === "P2002") {
        return {
          statusCode: HttpStatus.CONFLICT,
          error: "Conflict",
          message: "数据违反唯一性约束",
        };
      }
      if (exception.code === "P2003") {
        return {
          statusCode: HttpStatus.CONFLICT,
          error: "Conflict",
          message: "数据仍被其他记录关联，无法执行当前操作",
        };
      }
    }

    console.error(exception);
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
      message: "服务器内部错误",
    };
  }
}
