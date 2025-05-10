"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateUtil = void 0;
class DateUtil {
    static formatDate(date) {
        return date.toISOString().split("T")[0];
    }
    static formatDateTime(date) {
        return date.toISOString().replace("T", " ").split(".")[0];
    }
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
}
exports.DateUtil = DateUtil;
//# sourceMappingURL=date.util.js.map