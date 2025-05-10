import { Repository } from "typeorm";
import { Product } from "../../product/entities/product.entity";
import { User } from "../../user/entities/user.entity";
export declare class RecommendService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    guessYouLike(user: User, limit?: number): Promise<Product[]>;
}
