import { Product } from './Product.entity';
export declare class ProductSku {
    id: string;
    productId: string;
    product: Product;
    skuCode: string;
    specifications: Record<string, string>;
    price: number;
    stock: number;
    isActive: boolean;
}
