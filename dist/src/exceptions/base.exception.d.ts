import { HttpStatus } from '@nestjs/common';
export declare class BaseException extends Error {
    readonly message: string;
    readonly statusCode: HttpStatus;
    readonly data?: any;
    constructor(message: string, statusCode?: HttpStatus, data?: any);
}
