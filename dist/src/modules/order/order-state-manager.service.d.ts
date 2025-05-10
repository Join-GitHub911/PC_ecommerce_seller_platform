import { EventEmitter2 } from "@nestjs/event-emitter";
import { OrderExceptionHandler } from "./order-exception-handler.service";
import { NotificationService } from "../notification/notification.service";
import { InventoryService } from "../inventory/inventory.service";
import { PaymentService } from "../payment/payment.service";
export declare class OrderStateManager {
    private readonly eventEmitter;
    private readonly exceptionHandler;
    private readonly notificationService;
    private readonly inventoryService;
    private readonly paymentService;
    private readonly stateTransitions;
    constructor(eventEmitter: EventEmitter2, exceptionHandler: OrderExceptionHandler, notificationService: NotificationService, inventoryService: InventoryService, paymentService: PaymentService);
    private validateStateTransition;
    private emitOrderEvent;
    handlePaymentSuccess(params: {
        orderId: string;
        paymentId: string;
        amount: number;
        payTime: string;
    }): Promise<void>;
    handleShipment(params: {
        orderId: string;
        trackingNumber: string;
        carrier: string;
    }): Promise<void>;
}
