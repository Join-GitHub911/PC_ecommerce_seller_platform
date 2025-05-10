import { CartItem } from './CartItem';
export declare class Cart {
    id: string;
    userId: string;
    items: CartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
