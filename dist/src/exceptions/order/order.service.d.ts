export declare class OrderService {
    createOrder(data: any): Promise<{
        orderId: string;
        status: string;
    }>;
    getOrders(data: any): Promise<{
        total: number;
        list: any[];
    }>;
    getOrderDetail(id: string, userId: string): Promise<{
        orderId: string;
        status: string;
        items: any[];
    }>;
    cancelOrder(data: {
        orderId: string;
        userId: string;
        reason: string;
    }): Promise<{
        success: boolean;
    }>;
    confirmReceipt(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
