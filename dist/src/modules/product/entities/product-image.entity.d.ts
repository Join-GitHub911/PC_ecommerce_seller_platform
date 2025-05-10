import { Product } from './product.entity';
export declare class ProductImage {
    id: number;
    url: string;
    sortOrder: number;
    isMain: boolean;
    product: Product;
    createdAt: Date;
}
