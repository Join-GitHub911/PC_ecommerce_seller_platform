export declare class ProductImageDto {
    url: string;
    sort?: number;
}
export declare class ProductSpecificationDto {
    name: string;
    value: string;
    price?: number;
}
export declare class CreateProductDto {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    isActive?: boolean;
    images?: ProductImageDto[];
    specifications?: ProductSpecificationDto[];
    tags?: string[];
    stock?: number;
}
