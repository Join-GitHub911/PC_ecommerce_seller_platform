import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
export declare class BrowseHistory {
    id: number;
    userId: number;
    user: User;
    productId: number;
    product: Product;
    viewCount: number;
    createdAt: Date;
    lastViewedAt: Date;
}
