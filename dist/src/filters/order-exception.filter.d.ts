import { ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
export declare class OrderException extends Error {
    readonly message: string;
    readonly statusCode: HttpStatus;
    readonly orderData?: any;
    constructor(message: string, statusCode?: HttpStatus, orderData?: any);
}
export declare class OrderExceptionFilter implements ExceptionFilter {
    private readonly logger;
    catch(exception: OrderException, host: ArgumentsHost): void;
}
