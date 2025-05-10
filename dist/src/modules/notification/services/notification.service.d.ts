import { Repository } from "typeorm";
import { Notification } from "../entities/notification.entity";
import { I18nService } from "nestjs-i18n";
export declare class NotificationService {
    private readonly notificationRepository;
    private readonly i18n;
    constructor(notificationRepository: Repository<Notification>, i18n: I18nService);
    getTypeText(type: string, lang?: string): Promise<string>;
    findById(id: string): Promise<Notification>;
    send(userId: string, title: string, content: string, channel?: string, templateKey?: string, params?: any): Promise<Notification>;
    markDelivered(notificationId: string): Promise<void>;
    getUserNotifications(userId: string, channel?: string): Promise<Notification[]>;
    markAsRead(userId: string, id: string): Promise<void>;
    markAllAsRead(userId: string): Promise<void>;
}
