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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../entities/review.entity");
const order_service_1 = require("../../order/services/order.service");
const product_service_1 = require("../../product/services/product.service");
let ReviewService = class ReviewService {
    constructor(reviewRepository, orderService, productService) {
        this.reviewRepository = reviewRepository;
        this.orderService = orderService;
        this.productService = productService;
    }
    async create(userId, createReviewDto) {
        const order = await this.orderService.findById(createReviewDto.orderId);
        if (order.userId !== userId) {
            throw new common_1.BadRequestException("无权评价此订单");
        }
        if (order.status !== "completed") {
            throw new common_1.BadRequestException("订单未完成，不能评价");
        }
        await this.productService.findById(createReviewDto.productId);
        const existingReview = await this.reviewRepository.findOne({
            where: {
                orderId: createReviewDto.orderId,
                productId: createReviewDto.productId,
            },
        });
        if (existingReview) {
            throw new common_1.BadRequestException("已经评价过此商品");
        }
        const review = this.reviewRepository.create(Object.assign(Object.assign({}, createReviewDto), { userId }));
        return this.reviewRepository.save(review);
    }
    async findByProduct(productId, options) {
        const { page = 1, limit = 10, rating, hasImages } = options;
        const queryBuilder = this.reviewRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.user", "user")
            .where("review.productId = :productId", { productId });
        if (rating) {
            queryBuilder.andWhere("review.rating = :rating", { rating });
        }
        if (hasImages) {
            queryBuilder.andWhere("review.images IS NOT NULL");
            queryBuilder.andWhere("review.images != :empty", { empty: "{}" });
        }
        queryBuilder
            .orderBy("review.createdAt", "DESC")
            .skip((page - 1) * limit)
            .take(limit);
        return queryBuilder.getManyAndCount();
    }
    async findByUser(userId, page = 1, limit = 10) {
        return this.reviewRepository.findAndCount({
            where: { userId },
            relations: ["product", "product.images"],
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
    }
    async reply(id, replyDto) {
        const review = await this.findById(id);
        review.reply = replyDto.reply;
        review.replyAt = new Date();
        return this.reviewRepository.save(review);
    }
    async findById(id) {
        const review = await this.reviewRepository.findOne({
            where: { id },
            relations: ["user", "product"],
        });
        if (!review) {
            throw new common_1.NotFoundException("评价不存在");
        }
        return review;
    }
    async delete(id, userId) {
        const review = await this.findById(id);
        if (review.userId !== userId) {
            throw new common_1.BadRequestException("无权删除此评价");
        }
        await this.reviewRepository.remove(review);
    }
    async hasOrderReview(orderId) {
        const count = await this.reviewRepository.count({ where: { orderId } });
        return count > 0;
    }
    async createAutoReview(order) {
        for (const item of order.items) {
            await this.reviewRepository.save({
                userId: order.userId,
                productId: item.productId,
                orderId: order.id,
                content: "系统自动好评",
                rating: 5,
                isAnonymous: true,
            });
        }
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        order_service_1.OrderService,
        product_service_1.ProductService])
], ReviewService);
//# sourceMappingURL=review.service.js.map