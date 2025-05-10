import { Repository } from "typeorm";
import { Article } from "../entities/article.entity";
export declare class ArticleService {
    private readonly articleRepository;
    constructor(articleRepository: Repository<Article>);
    create(dto: Partial<Article>): Promise<Article>;
    findAll(page?: number, limit?: number, keyword?: string): Promise<{
        items: Article[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<Article>;
    publish(id: string, isPublished: boolean): Promise<Article>;
    reviewArticle(id: string, isReviewed: boolean): Promise<Article>;
    autoPublish(): Promise<void>;
}
