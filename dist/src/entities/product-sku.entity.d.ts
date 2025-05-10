import { Product } from './product.entity';
export declare class ProductSku {
    id: string;
    productId: string;
    product: Product;
    skuCode: string;
    attributes: Record<string, any>;
    price: number;
    originalPrice: number;
    stock: number;
    status: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
