import { Product } from './product.entity';
export declare class ProductSku {
    id: number;
    productId: number;
    product: Product;
    name: string;
    specifications: Record<string, any>;
    price: number;
    originalPrice: number;
    stock: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
