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
const review_entity_1 = require("./entities/review.entity");
const order_service_1 = require("../order/order.service");
const order_type_1 = require("../../types/order.type");
let ReviewService = class ReviewService {
    constructor(reviewRepository, orderService) {
        this.reviewRepository = reviewRepository;
        this.orderService = orderService;
    }
    async create(user, createReviewDto) {
        const { orderId, productId, rating, content, images } = createReviewDto;
        const order = await this.orderService.findOne(orderId);
        if (order.userId !== user.id) {
            throw new common_1.BadRequestException('不能评价不属于您的订单');
        }
        if (order.status !== order_type_1.OrderStatus.COMPLETED) {
            throw new common_1.BadRequestException('只有已完成的订单才能评价');
        }
        const orderItem = order.items.find(item => item.productId === productId);
        if (!orderItem) {
            throw new common_1.BadRequestException('评价的商品不在该订单中');
        }
        const existingReview = await this.reviewRepository.findOne({
            where: {
                userId: user.id,
                orderId,
                productId
            }
        });
        if (existingReview) {
            throw new common_1.BadRequestException('您已经评价过该商品');
        }
        const review = this.reviewRepository.create({
            userId: user.id,
            orderId,
            productId,
            rating,
            content,
            images,
            isPublished: true
        });
        return this.reviewRepository.save(review);
    }
    async findByProduct(productId, page = 1, limit = 10) {
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: {
                productId,
                isPublished: true
            },
            relations: ['user'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { reviews, total };
    }
    async findByUser(userId, page = 1, limit = 10) {
        const [reviews, total] = await this.reviewRepository.findAndCount({
            where: { userId },
            relations: ['product'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { reviews, total };
    }
    async addAdminReply(reviewId, reply) {
        const review = await this.reviewRepository.findOne({
            where: { id: Number(reviewId) }
        });
        if (!review) {
            throw new common_1.NotFoundException('评价不存在');
        }
        review.adminReply = reply;
        review.adminReplyTime = new Date();
        return this.reviewRepository.save(review);
    }
    async getProductRatingSummary(productId) {
        const reviews = await this.reviewRepository.find({
            where: {
                productId,
                isPublished: true
            },
            select: ['rating']
        });
        const totalReviews = reviews.length;
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0;
        const ratingCount = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        };
        reviews.forEach(review => {
            ratingCount[review.rating] += 1;
        });
        return {
            totalReviews,
            averageRating,
            ratingDistribution: ratingCount
        };
    }
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        order_service_1.OrderService])
], ReviewService);
//# sourceMappingURL=review.service.js.map