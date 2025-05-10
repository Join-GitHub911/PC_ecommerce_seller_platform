import { User } from '../../user/entities/user.entity';
import { NotificationType } from '../enums/notification-type.enum';
export declare class Notification {
    id: number;
    userId: number;
    user: User;
    type: NotificationType;
    title: string;
    content: string;
    data: Record<string, any>;
    isRead: boolean;
    readAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
