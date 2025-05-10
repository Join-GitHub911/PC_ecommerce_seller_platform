import { Repository } from "typeorm";
import { Product } from "../entities/product.entity";
import { CreateProductDto } from "../dto/create-product.dto";
import { UpdateProductDto } from "../dto/update-product.dto";
import { CategoryService } from "./category.service";
export declare class ProductService {
    private readonly productRepository;
    private readonly categoryService;
    constructor(productRepository: Repository<Product>, categoryService: CategoryService);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(page?: number, limit?: number, category?: string, keyword?: string): Promise<{
        items: Product[];
        total: number;
    }>;
    findById(id: string): Promise<Product>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<Product>;
    updateStock(id: string, quantity: number): Promise<void>;
    delete(id: string): Promise<void>;
    updateSpecPrices(productId: string, specPrices: {
        specId: string;
        price: number;
    }[]): Promise<Product>;
    updateWarehouseStocks(productId: string, warehouseStocks: {
        warehouseId: string;
        stock: number;
    }[]): Promise<Product>;
    autoOnOffSale(): Promise<void>;
}
