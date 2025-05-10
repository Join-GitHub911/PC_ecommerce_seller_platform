import { Product } from "./product.entity";
export declare class Category {
    id: string;
    name: string;
    parentId: string;
    level: number;
    isActive: boolean;
    sort: number;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}
