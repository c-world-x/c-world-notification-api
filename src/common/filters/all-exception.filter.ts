import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly config: ConfigService) {}

  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const shouldLogStack = !["staging", "production"].includes(this.config.get("NODE_ENV") as string);

    if (host.getType() === "rpc") {
      // @ts-ignore
      return {
        status: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception["response"].message,
        stack: shouldLogStack ? exception.stack : undefined,
      };
    }

    throw exception;
  }
}
