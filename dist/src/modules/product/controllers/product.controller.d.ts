import { ProductService } from "../services/product.service";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(page?: number, limit?: number, category?: string, keyword?: string): Promise<{
        items: import("../entities/product.entity").Product[];
        total: number;
    }>;
    findOne(id: string): Promise<import("../entities/product.entity").Product>;
}
