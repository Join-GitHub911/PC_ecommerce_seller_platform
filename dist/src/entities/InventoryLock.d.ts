import { Product } from './Product';
import { Order } from './Order';
export declare class InventoryLock {
    id: string;
    orderId: string;
    order: Order;
    productId: string;
    product: Product;
    quantity: number;
    lockTime: Date;
}
