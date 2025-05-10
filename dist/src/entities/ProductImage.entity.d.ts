import { Product } from './product.entity';
export declare class ProductImage {
    id: string;
    productId: string;
    product: Product;
    url: string;
    sort: number;
    isMain: boolean;
}
