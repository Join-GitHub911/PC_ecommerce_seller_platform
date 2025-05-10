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
var RecommendationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecommendationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../product/entities/product.entity");
const browse_history_entity_1 = require("../user-activity/entities/browse-history.entity");
const order_entity_1 = require("../order/entities/order.entity");
const order_item_entity_1 = require("../order/entities/order-item.entity");
let RecommendationService = RecommendationService_1 = class RecommendationService {
    constructor(productRepository, browseHistoryRepository, orderRepository, orderItemRepository) {
        this.productRepository = productRepository;
        this.browseHistoryRepository = browseHistoryRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.logger = new common_1.Logger(RecommendationService_1.name);
    }
    async getHotProducts(limit = 10) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const salesData = await this.orderItemRepository
            .createQueryBuilder('item')
            .select('item.productId', 'productId')
            .addSelect('SUM(item.quantity)', 'totalSold')
            .innerJoin('item.order', 'order')
            .where('order.createdAt >= :date', { date: thirtyDaysAgo })
            .andWhere('order.status NOT IN (:...statuses)', { statuses: ['CANCELED', 'REFUNDED'] })
            .groupBy('item.productId')
            .getRawMany();
        const viewData = await this.browseHistoryRepository
            .createQueryBuilder('history')
            .select('history.productId', 'productId')
            .addSelect('SUM(history.viewCount)', 'totalViews')
            .where('history.createdAt >= :date', { date: thirtyDaysAgo })
            .groupBy('history.productId')
            .getRawMany();
        const productScores = new Map();
        salesData.forEach(item => {
            const productId = Number(item.productId);
            productScores.set(productId, {
                sales: Number(item.totalSold),
                views: 0
            });
        });
        viewData.forEach(item => {
            const productId = Number(item.productId);
            const existing = productScores.get(productId) || { sales: 0, views: 0 };
            productScores.set(productId, Object.assign(Object.assign({}, existing), { views: Number(item.totalViews) }));
        });
        const productIds = Array.from(productScores.entries())
            .map(([id, data]) => ({
            id,
            score: data.sales * 0.7 + data.views * 0.3
        }))
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(item => item.id);
        if (productIds.length === 0) {
            return this.productRepository.find({
                where: { isActive: true },
                order: { createdAt: 'DESC' },
                take: limit
            });
        }
        return this.productRepository.find({
            where: { id: In(productIds), isActive: true }
        });
    }
    async getPersonalizedRecommendations(userId, limit = 10) {
        const recentCategories = await this.browseHistoryRepository
            .createQueryBuilder('history')
            .select('product.categoryId', 'categoryId')
            .addSelect('COUNT(*)', 'count')
            .innerJoin('history.product', 'product')
            .where('history.userId = :userId', { userId })
            .groupBy('product.categoryId')
            .orderBy('count', 'DESC')
            .limit(3)
            .getRawMany();
        const viewedProductIds = await this.browseHistoryRepository
            .createQueryBuilder('history')
            .select('history.productId')
            .where('history.userId = :userId', { userId })
            .getMany()
            .then(results => results.map(item => item.productId));
        if (recentCategories.length === 0) {
            return this.getHotProducts(limit);
        }
        const categoryIds = recentCategories.map(c => c.categoryId);
        const recommendations = await this.productRepository
            .createQueryBuilder('product')
            .where('product.categoryId IN (:...categoryIds)', { categoryIds })
            .andWhere('product.isActive = :isActive', { isActive: true })
            .andWhere('product.id NOT IN (:...viewedProductIds)', {
            viewedProductIds: viewedProductIds.length > 0 ? viewedProductIds : [0]
        })
            .orderBy('product.createdAt', 'DESC')
            .limit(limit)
            .getMany();
        if (recommendations.length < limit) {
            const hotProducts = await this.getHotProducts(limit - recommendations.length);
            const existingIds = new Set(recommendations.map(p => p.id));
            for (const product of hotProducts) {
                if (!existingIds.has(product.id)) {
                    recommendations.push(product);
                    if (recommendations.length >= limit)
                        break;
                }
            }
        }
        return recommendations;
    }
    async getSimilarProducts(productId, limit = 6) {
        const product = await this.productRepository.findOne({
            where: { id: Number(productId) },
            relations: ['category']
        });
        if (!product)
            return [];
        return this.productRepository.find({
            where: {
                categoryId: product.category.id,
                id: Not(product.id),
                isActive: true
            },
            order: { createdAt: 'DESC' },
            take: limit
        });
    }
    async getFrequentlyBoughtTogether(productId, limit = 5) {
        const ordersWithProduct = await this.orderItemRepository
            .createQueryBuilder('item')
            .select('item.orderId')
            .where('item.productId = :productId', { productId })
            .getMany()
            .then(results => results.map(item => item.orderId));
        if (ordersWithProduct.length === 0) {
            return this.getSimilarProducts(productId, limit);
        }
        const relatedProducts = await this.orderItemRepository
            .createQueryBuilder('item')
            .select('item.productId', 'productId')
            .addSelect('COUNT(DISTINCT item.orderId)', 'orderCount')
            .where('item.orderId IN (:...orderIds)', { orderIds: ordersWithProduct })
            .andWhere('item.productId != :productId', { productId })
            .groupBy('item.productId')
            .orderBy('orderCount', 'DESC')
            .limit(limit)
            .getRawMany();
        const relatedProductIds = relatedProducts.map(p => Number(p.productId));
        if (relatedProductIds.length === 0) {
            return this.getSimilarProducts(productId, limit);
        }
        return this.productRepository.find({
            where: { id: In(relatedProductIds), isActive: true }
        });
    }
};
exports.RecommendationService = RecommendationService;
exports.RecommendationService = RecommendationService = RecommendationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(browse_history_entity_1.BrowseHistory)),
    __param(2, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(3, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RecommendationService);
//# sourceMappingURL=recommendation.service.js.map