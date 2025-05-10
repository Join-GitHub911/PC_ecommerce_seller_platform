import { PaymentMethod, PaymentStatus } from "@/types/payment.type";
export declare class PaymentMethodEntity {
    id: string;
    method: PaymentMethod;
    status: PaymentStatus;
    config: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
