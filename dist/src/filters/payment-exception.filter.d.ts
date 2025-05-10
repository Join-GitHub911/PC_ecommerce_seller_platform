import { ExceptionFilter, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
export declare class PaymentException extends Error {
    readonly message: string;
    readonly statusCode: HttpStatus;
    readonly paymentData?: any;
    constructor(message: string, statusCode?: HttpStatus, paymentData?: any);
}
export declare class PaymentExceptionFilter implements ExceptionFilter {
    private readonly i18n;
    private readonly logger;
    constructor(i18n: I18nService);
    catch(exception: PaymentException, host: ArgumentsHost): Promise<void>;
}
