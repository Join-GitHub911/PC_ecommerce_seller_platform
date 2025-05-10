export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    isActive: boolean;
    images: string[];
    specifications: Record<string, any>;
    stock: number;
    availableStock: number;
    mainImage: string;
    createdAt: Date;
    updatedAt: Date;
}
