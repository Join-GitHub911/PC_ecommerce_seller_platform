import { ProductSku } from './product-sku.entity';
import { Category } from './category.entity';
export declare class Product {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    category: Category;
    brandId: string;
    images: string[];
    attributes?: Record<string, any>;
    status: string;
    salesCount: number;
    viewCount: number;
    favoriteCount: number;
    metadata?: Record<string, any>;
    skus: ProductSku[];
    createdAt: Date;
    updatedAt: Date;
}
