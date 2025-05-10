export declare class BaseException extends Error {
    readonly code: string;
    readonly message: string;
    readonly status: number;
    readonly data?: any;
    constructor(code: string, message: string, status?: number, data?: any);
}
