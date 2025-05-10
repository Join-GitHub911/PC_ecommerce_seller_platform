import { User } from '../modules/user/entities/user.entity';
export declare class Cart {
    id: string;
    userId: string;
    user: User;
    items: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
