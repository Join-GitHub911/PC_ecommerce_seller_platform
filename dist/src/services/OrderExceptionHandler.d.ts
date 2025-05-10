import { OrderStatus } from "@/types/order.type";
import { Order } from "@/entities/order.entity";
import { Repository } from 'typeorm';
export declare class OrderExceptionHandler {
    private orderRepository;
    private readonly logger;
    constructor(orderRepository: Repository<Order>);
    handleOrderNotFound(orderId: number): never;
    handleInvalidStatus(orderId: number, currentStatus: OrderStatus, expectedStatus: OrderStatus): never;
    handlePaymentError(error: Error): never;
    handleInsufficientInventory(productId: number, requestedQuantity: number, availableQuantity: number): never;
    handleValidationError(message: string): never;
    handleOrderCreationFailure(error: any, cleanup?: () => Promise<void>): Promise<void>;
    handleCancellationFailure(orderId: number, error: any): never;
    handleRefundFailure(orderId: number, error: any, notifyAdmin?: boolean): Promise<void>;
    private notifyAdminAboutRefundFailure;
    handlePaymentFailure(orderId: number): Promise<void>;
    handleInventoryException(orderId: number): Promise<void>;
    handleException(order: Order, error: Error): Promise<void>;
    handleOrderError(error: Error): void;
    handleCartError(error: Error): void;
    handleProductNotFound(productId: number): void;
    handleInvalidQuantity(quantity: number): void;
    handleInvalidPrice(price: number): void;
    handleInvalidUser(userId: number): void;
}
