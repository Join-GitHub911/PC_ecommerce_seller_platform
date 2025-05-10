import { Product } from "./product.entity";
import { Order } from "./order.entity";
export declare class InventoryLock {
    id: string;
    orderId: string;
    order: Order;
    productId: string;
    product: Product;
    quantity: number;
    lockTime: Date;
}
