import { Category } from "./category.entity";
import { ProductImage } from "./product-image.entity";
import { ProductSpecification } from "./product-specification.entity";
import { ProductSku } from './product-sku.entity';
export declare enum ProductStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    OFFLINE = "offline"
}
export declare class Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice: number;
    stock: number;
    sales: number;
    status: ProductStatus;
    isActive: boolean;
    category: Category;
    categoryId: string;
    images: ProductImage[];
    specifications: ProductSpecification[];
    attributes: Record<string, string>[];
    tags: string[];
    specPrices: {
        specId: string;
        price: number;
    }[];
    autoOnSaleAt: Date;
    autoOffSaleAt: Date;
    warehouseStocks: {
        warehouseId: string;
        stock: number;
    }[];
    skus: ProductSku[];
    createdAt: Date;
    updatedAt: Date;
}
