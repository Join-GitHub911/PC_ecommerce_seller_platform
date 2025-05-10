"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const article_entity_1 = require("../entities/article.entity");
let ArticleService = class ArticleService {
    constructor(articleRepository) {
        this.articleRepository = articleRepository;
    }
    async create(dto) {
        const article = this.articleRepository.create(dto);
        return this.articleRepository.save(article);
    }
    async findAll(page = 1, limit = 10, keyword) {
        const where = {};
        if (keyword) {
            where.title = (0, typeorm_2.Like)(`%${keyword}%`);
        }
        const [items, total] = await this.articleRepository.findAndCount({
            where,
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }
    async findById(id) {
        const article = await this.articleRepository.findOne({ where: { id } });
        if (!article)
            throw new common_1.NotFoundException("文章不存在");
        return article;
    }
    async publish(id, isPublished) {
        const article = await this.findById(id);
        article.isPublished = isPublished;
        return this.articleRepository.save(article);
    }
    async reviewArticle(id, isReviewed) {
        const article = await this.findById(id);
        article.isReviewed = isReviewed;
        return this.articleRepository.save(article);
    }
    async autoPublish() {
        const now = new Date();
        await this.articleRepository.update({ isPublished: false, isReviewed: true, publishAt: (0, typeorm_2.LessThanOrEqual)(now) }, { isPublished: true });
    }
};
exports.ArticleService = ArticleService;
exports.ArticleService = ArticleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(article_entity_1.Article)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ArticleService);
//# sourceMappingURL=article.service.js.map