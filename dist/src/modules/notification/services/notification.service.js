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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("../entities/notification.entity");
const nestjs_i18n_1 = require("nestjs-i18n");
let NotificationService = class NotificationService {
    constructor(notificationRepository, i18n) {
        this.notificationRepository = notificationRepository;
        this.i18n = i18n;
    }
    async getTypeText(type, lang = "zh") {
        return this.i18n.translate(`NOTIFICATION.TYPE.${type}`, { lang });
    }
    async findById(id) {
        const notification = await this.notificationRepository.findOne({
            where: { id },
        });
        if (!notification) {
            throw new common_1.NotFoundException("通知不存在");
        }
        return notification;
    }
    async send(userId, title, content, channel = "site", templateKey, params) {
        let delivered = false;
        let deliveredAt = undefined;
        if (channel === "sms") {
            delivered = true;
            deliveredAt = new Date();
        }
        else if (channel === "email") {
            delivered = true;
            deliveredAt = new Date();
        }
        else if (channel === "wechat") {
            delivered = true;
            deliveredAt = new Date();
        }
        else if (channel === "app") {
            delivered = true;
            deliveredAt = new Date();
        }
        else {
            delivered = true;
            deliveredAt = new Date();
        }
        const notification = this.notificationRepository.create({
            userId,
            title,
            content,
            channel,
            templateKey,
            isDelivered: delivered,
            deliveredAt,
            isRead: false,
        });
        return this.notificationRepository.save(notification);
    }
    async markDelivered(notificationId) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId },
        });
        if (notification) {
            notification.isDelivered = true;
            notification.deliveredAt = new Date();
            await this.notificationRepository.save(notification);
        }
    }
    async getUserNotifications(userId, channel) {
        const query = this.notificationRepository
            .createQueryBuilder("notification")
            .where("notification.userId = :userId", { userId });
        if (channel) {
            query.andWhere("notification.channel = :channel", { channel });
        }
        return query.orderBy("notification.createdAt", "DESC").getMany();
    }
    async markAsRead(userId, id) {
        await this.notificationRepository.update({ id, userId }, { isRead: true, readAt: new Date() });
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({ userId, isRead: false }, { isRead: true, readAt: new Date() });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        nestjs_i18n_1.I18nService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map