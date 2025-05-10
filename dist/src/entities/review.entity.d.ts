import { User } from '@/modules/user/entities/user.entity';
import { Product } from './product.entity';
import { Order } from './order.entity';
export declare class Review {
    id: string;
    userId: string;
    user: User;
    productId: string;
    product: Product;
    orderId: string;
    order: Order;
    rating: number;
    content: string;
    images?: string[];
    isAnonymous: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
