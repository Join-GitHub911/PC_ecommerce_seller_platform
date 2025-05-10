"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
class BaseException extends Error {
    constructor(code, message, status = 400, data) {
        super(message);
        this.code = code;
        this.message = message;
        this.status = status;
        this.data = data;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=BaseException.js.map