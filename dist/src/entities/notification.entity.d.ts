export declare class Notification {
    id: string;
    userId: string;
    type: string;
    title: string;
    content: string;
    data?: Record<string, any>;
    isRead: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
