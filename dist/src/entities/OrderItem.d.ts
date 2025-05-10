import { Order } from './Order';
import { Product } from './Product';
export declare class OrderItem {
    id: number;
    order: Order;
    orderId: string;
    product: Product;
    productId: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    amount: number;
    specifications: Record<string, string>;
}
