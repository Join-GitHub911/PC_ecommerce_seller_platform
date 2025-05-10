"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllowedOrderStatuses = exports.ALLOWED_ORDER_STATUSES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.ALLOWED_ORDER_STATUSES_KEY = "allowedOrderStatuses";
const AllowedOrderStatuses = (...statuses) => (0, common_1.SetMetadata)(exports.ALLOWED_ORDER_STATUSES_KEY, statuses);
exports.AllowedOrderStatuses = AllowedOrderStatuses;
//# sourceMappingURL=order-status.decorator.js.map