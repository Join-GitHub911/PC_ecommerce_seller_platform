import { Repository } from "typeorm";
import { Category } from "@/entities/Category";
export declare class CategoryService {
    private readonly categoryRepository;
    constructor(categoryRepository: Repository<Category>);
    findById(id: string): Promise<Category>;
    findAll(): Promise<Category[]>;
}
