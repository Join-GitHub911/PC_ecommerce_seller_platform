import { NotificationService } from "@/modules/notification/notification.service";
import { InventoryService } from "@/modules/inventory/inventory.service";
import { IOrderEvent } from "../interfaces/order-event.interface";
export declare class OrderEventListener {
    private readonly notificationService;
    private readonly inventoryService;
    constructor(notificationService: NotificationService, inventoryService: InventoryService);
    handleOrderEvent(event: IOrderEvent): Promise<void>;
    private handleOrderCreated;
    private handleOrderPaid;
    private handleOrderShipped;
    private handleOrderCompleted;
    private handleOrderCancelled;
    private updateProductSales;
}
