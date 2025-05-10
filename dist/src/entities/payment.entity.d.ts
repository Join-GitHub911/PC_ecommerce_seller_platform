export declare class Payment {
    id: string;
    orderId: string;
    userId: string;
    paymentMethod: string;
    amount: number;
    status: string;
    paymentData?: Record<string, any>;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
