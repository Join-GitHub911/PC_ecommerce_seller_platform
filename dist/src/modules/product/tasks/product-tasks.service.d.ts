import { ProductService } from "../services/product.service";
export declare class ProductTasksService {
    private readonly productService;
    constructor(productService: ProductService);
    autoOnOffSale(): Promise<void>;
}
