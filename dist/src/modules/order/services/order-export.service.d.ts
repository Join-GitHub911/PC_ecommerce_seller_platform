import { Repository } from "typeorm";
import { Order } from "@/entities/Order";
import { OrderStatus } from "@/types/order";
export declare class OrderExportService {
    private orderRepository;
    constructor(orderRepository: Repository<Order>);
    exportToExcel(params: {
        startDate?: Date;
        endDate?: Date;
        status?: OrderStatus;
        userId?: string;
    }): Promise<Buffer>;
    exportToPDF(orderId: string): Promise<Buffer>;
    private getOrders;
    private getStatusText;
}
