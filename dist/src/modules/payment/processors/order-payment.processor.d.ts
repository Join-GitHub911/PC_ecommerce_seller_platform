import { Job } from 'bull';
import { OrderService } from '../../order/order.service';
import { OrderStateManager } from '../../../services/OrderStateManager';
export declare class OrderPaymentProcessor {
    private readonly orderService;
    private readonly orderStateManager;
    private readonly logger;
    constructor(orderService: OrderService, orderStateManager: OrderStateManager);
    handleOrderExpiration(job: Job<{
        orderId: number;
    }>): Promise<void>;
}
