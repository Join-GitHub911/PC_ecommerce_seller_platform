import { Product } from './product.entity';
export declare class Category {
    id: number;
    name: string;
    description: string;
    icon: string;
    sortOrder: number;
    isActive: boolean;
    parent: Category;
    children: Category[];
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
