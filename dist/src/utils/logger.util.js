"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = exports.logger = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const path_1 = require("path");
const logDir = "logs";
exports.logger = new common_1.Logger("App");
exports.winstonLogger = winston_1.default.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss",
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json()),
    defaultMeta: { service: "e-commerce-platform" },
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
        }),
        new winston_1.default.transports.File({
            filename: (0, path_1.join)(logDir, "error.log"),
            level: "error",
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston_1.default.transports.File({
            filename: (0, path_1.join)(logDir, "combined.log"),
            maxsize: 5242880,
            maxFiles: 5,
        }),
    ],
});
//# sourceMappingURL=logger.util.js.map