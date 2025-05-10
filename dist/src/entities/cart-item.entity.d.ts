import { Cart } from "./cart.entity";
import { Product } from "./product.entity";
export declare class CartItem {
    id: string;
    cart: Cart;
    product: Product;
    quantity: number;
    price: number;
    specifications: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
