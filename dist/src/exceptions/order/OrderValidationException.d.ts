import { BaseException } from "../BaseException";
export declare class OrderValidationException extends BaseException {
    constructor(message: string, errors?: Record<string, string[]>);
}
