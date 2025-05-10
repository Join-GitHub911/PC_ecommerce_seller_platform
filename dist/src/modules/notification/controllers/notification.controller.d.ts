import { NotificationService } from "../services/notification.service";
import { User } from "@/modules/user/entities/user.entity";
import { CreateNotificationDto } from "../dto/create-notification.dto";
import { I18nContext } from "nestjs-i18n";
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    getUserNotifications(user: User, channel?: string): Promise<import("../entities/notification.entity").Notification[]>;
    markAsRead(user: User, id: string): Promise<{
        message: string;
    }>;
    markAllAsRead(user: User): Promise<{
        message: string;
    }>;
    send(dto: CreateNotificationDto): Promise<import("../entities/notification.entity").Notification>;
    getNotification(id: string, i18n: I18nContext): Promise<import("../entities/notification.entity").Notification>;
}
