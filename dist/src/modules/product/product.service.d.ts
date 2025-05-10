import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Category } from './entities/category.entity';
import { ProductImage } from './entities/product-image.entity';
import { ProductSku } from './entities/product-sku.entity';
import { CreateProductDto } from './dto/create-product.dto';
export declare class ProductService {
    private productRepository;
    private categoryRepository;
    private productImageRepository;
    private productSkuRepository;
    constructor(productRepository: Repository<Product>, categoryRepository: Repository<Category>, productImageRepository: Repository<ProductImage>, productSkuRepository: Repository<ProductSku>);
    create(createProductDto: CreateProductDto): Promise<Product>;
    findAll(): Promise<Product[]>;
    findOne(id: number): Promise<Product>;
    update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<Product>;
    remove(id: number): Promise<void>;
}
