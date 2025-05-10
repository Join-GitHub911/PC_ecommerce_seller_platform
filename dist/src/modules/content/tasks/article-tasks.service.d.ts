import { ArticleService } from "../services/article.service";
export declare class ArticleTasksService {
    private readonly articleService;
    constructor(articleService: ArticleService);
    autoPublish(): Promise<void>;
}
