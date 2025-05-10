import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
export declare class Favorite {
    id: number;
    userId: number;
    user: User;
    productId: number;
    product: Product;
    createdAt: Date;
    updatedAt: Date;
}
