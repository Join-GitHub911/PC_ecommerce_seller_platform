import { Product } from './product.entity';
export declare class ProductSpecification {
    id: string;
    productId: string;
    product: Product;
    name: string;
    values: string[];
    sort: number;
    createdAt: Date;
    updatedAt: Date;
}
