import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/entities/order.entity';
export declare class Review {
    id: number;
    userId: number;
    user: User;
    productId: number;
    product: Product;
    orderId: number;
    order: Order;
    rating: number;
    content: string;
    images: string[];
    isPublished: boolean;
    adminReply: string;
    adminReplyTime: Date;
    createdAt: Date;
    updatedAt: Date;
}
