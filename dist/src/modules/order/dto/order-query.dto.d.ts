import { OrderStatus } from "@/types/order.type";
export declare class OrderQueryDto {
    status?: OrderStatus;
    keyword?: string;
    page?: number;
    limit?: number;
    startDate?: Date;
    endDate?: Date;
}
