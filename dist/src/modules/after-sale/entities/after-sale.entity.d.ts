import { User } from "../../user/entities/user.entity";
import { Order } from "../../order/entities/order.entity";
export declare enum AfterSaleType {
    REFUND_ONLY = "refund_only",
    RETURN_REFUND = "return_refund",
    EXCHANGE = "exchange"
}
export declare enum AfterSaleStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    PROCESSING = "processing",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class AfterSale {
    id: string;
    userId: string;
    user: User;
    orderId: string;
    order: Order;
    type: AfterSaleType;
    status: AfterSaleStatus;
    reason: string;
    description: string;
    amount: number;
    images: string[];
    logisticsCompany: string;
    logisticsNo: string;
    adminRemark: string;
    applyCount: number;
    progress: {
        status: string;
        time: Date;
        remark?: string;
    }[];
    userComment: string;
    createdAt: Date;
    updatedAt: Date;
}
