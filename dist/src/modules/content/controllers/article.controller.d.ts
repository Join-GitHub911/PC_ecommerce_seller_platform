import { ArticleService } from "../services/article.service";
import { CreateArticleDto } from "../dto/create-article.dto";
export declare class ArticleController {
    private readonly articleService;
    constructor(articleService: ArticleService);
    findAll(page?: number, limit?: number, keyword?: string): Promise<{
        items: import("../entities/article.entity").Article[];
        total: number;
        page: number;
        limit: number;
    }>;
    findById(id: string): Promise<import("../entities/article.entity").Article>;
    create(dto: CreateArticleDto): Promise<import("../entities/article.entity").Article>;
    publish(id: string, body: {
        isPublished: boolean;
    }): Promise<import("../entities/article.entity").Article>;
    reviewArticle(id: string, isReviewed: boolean): Promise<import("../entities/article.entity").Article>;
}
