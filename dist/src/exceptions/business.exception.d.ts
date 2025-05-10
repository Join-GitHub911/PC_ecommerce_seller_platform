import { HttpException, HttpStatus } from "@nestjs/common";
import { ErrorCode } from "@/shared/error-code";
export declare class BusinessException extends HttpException {
    constructor(message: string, errorCode: ErrorCode, statusCode?: HttpStatus);
}
