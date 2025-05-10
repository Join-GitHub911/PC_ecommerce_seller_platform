import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { User } from '../user/entities/user.entity';
import { OrderStatus } from '../../types/order.type';
export declare class NotificationService {
    private notificationRepository;
    private userRepository;
    private readonly logger;
    constructor(notificationRepository: Repository<Notification>, userRepository: Repository<User>);
    sendOrderStatusNotification(params: {
        orderId: number;
        status: OrderStatus;
        userId: number;
        title: string;
        content: string;
    }): Promise<Notification>;
    sendPaymentSuccessNotification(orderId: number): Promise<void>;
    sendOrderCreatedNotification(orderId: number, userId: number): Promise<void>;
    sendOrderCanceledNotification(orderId: number, userId: number, reason: string): Promise<void>;
    getUnreadNotificationsForUser(userId: number): Promise<Notification[]>;
    markAsRead(notificationId: number, userId: number): Promise<Notification>;
    markAllAsRead(userId: number): Promise<void>;
}
