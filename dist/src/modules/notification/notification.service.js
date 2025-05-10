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
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const notification_type_enum_1 = require("./enums/notification-type.enum");
const user_entity_1 = require("../user/entities/user.entity");
const order_type_1 = require("../../types/order.type");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(notificationRepository, userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(NotificationService_1.name);
    }
    async sendOrderStatusNotification(params) {
        const { orderId, status, userId, title, content } = params;
        const notification = this.notificationRepository.create({
            userId,
            type: notification_type_enum_1.NotificationType.ORDER,
            title,
            content,
            data: {
                orderId,
                status,
            },
            isRead: false,
        });
        const savedNotification = await this.notificationRepository.save(notification);
        this.logger.log(`Sent order status notification: ${title} to user ${userId}`);
        return savedNotification;
    }
    async sendPaymentSuccessNotification(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
            relations: ['user'],
        });
        if (!order) {
            this.logger.warn(`Cannot send payment notification: Order ${orderId} not found`);
            return;
        }
        await this.sendOrderStatusNotification({
            orderId,
            status: order_type_1.OrderStatus.PAID,
            userId: order.user.id,
            title: '支付成功',
            content: `您的订单 ${order.orderNo} 已支付成功，我们将尽快为您发货!`,
        });
    }
    async sendOrderCreatedNotification(orderId, userId) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
        });
        if (!order) {
            this.logger.warn(`Cannot send order created notification: Order ${orderId} not found`);
            return;
        }
        await this.sendOrderStatusNotification({
            orderId,
            status: order_type_1.OrderStatus.PENDING,
            userId,
            title: '订单创建成功',
            content: `您的订单 ${order.orderNo} 已创建成功，请在15分钟内完成支付！`,
        });
    }
    async sendOrderCanceledNotification(orderId, userId, reason) {
        const order = await this.orderRepository.findOne({
            where: { id: Number(orderId) },
        });
        if (!order) {
            this.logger.warn(`Cannot send order canceled notification: Order ${orderId} not found`);
            return;
        }
        await this.sendOrderStatusNotification({
            orderId,
            status: order_type_1.OrderStatus.CANCELED,
            userId,
            title: '订单已取消',
            content: `您的订单 ${order.orderNo} 已取消，取消原因：${reason}`,
        });
    }
    async getUnreadNotificationsForUser(userId) {
        return this.notificationRepository.find({
            where: {
                userId,
                isRead: false,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async markAsRead(notificationId, userId) {
        const notification = await this.notificationRepository.findOne({
            where: {
                id: Number(notificationId),
                userId,
            },
        });
        if (!notification) {
            throw new Error(`Notification ${notificationId} not found`);
        }
        notification.isRead = true;
        notification.readAt = new Date();
        return this.notificationRepository.save(notification);
    }
    async markAllAsRead(userId) {
        await this.notificationRepository.update({
            userId,
            isRead: false,
        }, {
            isRead: true,
            readAt: new Date(),
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationService);
//# sourceMappingURL=notification.service.js.map