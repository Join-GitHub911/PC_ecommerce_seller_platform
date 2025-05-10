"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notification_service_1 = require("../services/notification.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_entity_1 = require("@/modules/user/entities/user.entity");
const create_notification_dto_1 = require("../dto/create-notification.dto");
const nestjs_i18n_1 = require("nestjs-i18n");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    async getUserNotifications(user, channel) {
        return this.notificationService.getUserNotifications(user.id, channel);
    }
    async markAsRead(user, id) {
        await this.notificationService.markAsRead(user.id, id);
        return { message: "已标记为已读" };
    }
    async markAllAsRead(user) {
        await this.notificationService.markAllAsRead(user.id);
        return { message: "全部已读" };
    }
    async send(dto) {
        return this.notificationService.send(dto.userId, dto.title, dto.content, dto.channel, dto.templateKey, dto.params);
    }
    async getNotification(id, i18n) {
        const notification = await this.notificationService.findById(id);
        if (!notification) {
            throw new common_1.NotFoundException(await i18n.t("NOTIFICATION.NOT_FOUND"));
        }
        return notification;
    }
};
exports.NotificationController = NotificationController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "获取我的通知" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("channel")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getUserNotifications", null);
__decorate([
    (0, common_1.Patch)(":id/read"),
    (0, swagger_1.ApiOperation)({ summary: "标记单条消息为已读" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object, String]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)("read-all"),
    (0, swagger_1.ApiOperation)({ summary: "全部标记为已读" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Post)("send"),
    (0, swagger_1.ApiOperation)({ summary: "发送通知（管理员/系统）" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof create_notification_dto_1.CreateNotificationDto !== "undefined" && create_notification_dto_1.CreateNotificationDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "send", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], NotificationController.prototype, "getNotification", null);
exports.NotificationController = NotificationController = __decorate([
    (0, swagger_1.ApiTags)("notifications"),
    (0, common_1.Controller)("notifications"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map