"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseException = void 0;
const common_1 = require("@nestjs/common");
class BaseException extends Error {
    constructor(message, statusCode = common_1.HttpStatus.BAD_REQUEST, data) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}
exports.BaseException = BaseException;
//# sourceMappingURL=base.exception.js.map