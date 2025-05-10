import { User } from './User';
import { CartItem } from './CartItem';
export declare class Cart {
    id: string;
    user: User;
    items: CartItem[];
    total: number;
    userId: string;
}
