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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promotion_entity_1 = require("./entities/promotion.entity");
const flash_sale_entity_1 = require("./entities/flash-sale.entity");
const product_entity_1 = require("../product/entities/product.entity");
const ioredis_1 = require("@nestjs-modules/ioredis");
const schedule_1 = require("@nestjs/schedule");
let PromotionService = class PromotionService {
    constructor(promotionRepository, flashSaleRepository, productRepository, redis) {
        this.promotionRepository = promotionRepository;
        this.flashSaleRepository = flashSaleRepository;
        this.productRepository = productRepository;
        this.redis = redis;
    }
    async updatePromotionStatus() {
        const now = new Date();
        await this.promotionRepository.update({
            status: promotion_entity_1.PromotionStatus.PENDING,
            startTime: (0, typeorm_2.LessThanOrEqual)(now)
        }, { status: promotion_entity_1.PromotionStatus.ACTIVE });
        await this.promotionRepository.update({
            status: promotion_entity_1.PromotionStatus.ACTIVE,
            endTime: (0, typeorm_2.LessThanOrEqual)(now)
        }, { status: promotion_entity_1.PromotionStatus.ENDED });
        await this.flashSaleRepository.update({
            status: flash_sale_entity_1.FlashSaleStatus.PENDING,
            startTime: (0, typeorm_2.LessThanOrEqual)(now)
        }, { status: flash_sale_entity_1.FlashSaleStatus.ACTIVE });
        await this.flashSaleRepository.update({
            status: flash_sale_entity_1.FlashSaleStatus.ACTIVE,
            endTime: (0, typeorm_2.LessThanOrEqual)(now)
        }, { status: flash_sale_entity_1.FlashSaleStatus.ENDED });
    }
    async getActivePromotions() {
        const now = new Date();
        return this.promotionRepository.find({
            where: {
                status: promotion_entity_1.PromotionStatus.ACTIVE,
                startTime: (0, typeorm_2.LessThanOrEqual)(now),
                endTime: (0, typeorm_2.MoreThanOrEqual)(now)
            }
        });
    }
    async getProductPromotions(productId) {
        const now = new Date();
        const directPromotions = await this.promotionRepository.find({
            where: {
                status: promotion_entity_1.PromotionStatus.ACTIVE,
                startTime: (0, typeorm_2.LessThanOrEqual)(now),
                endTime: (0, typeorm_2.MoreThanOrEqual)(now),
                applicableProducts: productId
            }
        });
        const product = await this.productRepository.findOne({
            where: { id: Number(productId) },
            relations: ['category']
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${productId} not found`);
        }
        const categoryPromotions = await this.promotionRepository.find({
            where: {
                status: promotion_entity_1.PromotionStatus.ACTIVE,
                startTime: (0, typeorm_2.LessThanOrEqual)(now),
                endTime: (0, typeorm_2.MoreThanOrEqual)(now),
                applicableCategories: product.category.id
            }
        });
        const globalPromotions = await this.promotionRepository.find({
            where: {
                status: promotion_entity_1.PromotionStatus.ACTIVE,
                startTime: (0, typeorm_2.LessThanOrEqual)(now),
                endTime: (0, typeorm_2.MoreThanOrEqual)(now),
                applicableProducts: null,
                applicableCategories: null
            }
        });
        const allPromotions = [...directPromotions, ...categoryPromotions, ...globalPromotions];
        const uniquePromotions = Array.from(new Map(allPromotions.map(item => [item.id, item])).values());
        return uniquePromotions;
    }
    async getActiveFlashSales() {
        const now = new Date();
        return this.flashSaleRepository.find({
            where: {
                status: flash_sale_entity_1.FlashSaleStatus.ACTIVE,
                startTime: (0, typeorm_2.LessThanOrEqual)(now),
                endTime: (0, typeorm_2.MoreThanOrEqual)(now)
            },
            relations: ['product']
        });
    }
    async getUpcomingFlashSales() {
        const now = new Date();
        const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return this.flashSaleRepository.find({
            where: {
                status: flash_sale_entity_1.FlashSaleStatus.PENDING,
                startTime: (0, typeorm_2.Between)(now, twentyFourHoursLater)
            },
            relations: ['product'],
            order: { startTime: 'ASC' }
        });
    }
    async participateFlashSale(userId, flashSaleId) {
        const flashSale = await this.flashSaleRepository.findOne({
            where: { id: Number(flashSaleId) },
            relations: ['product']
        });
        if (!flashSale) {
            throw new common_1.NotFoundException('秒杀活动不存在');
        }
        if (flashSale.status !== flash_sale_entity_1.FlashSaleStatus.ACTIVE) {
            throw new common_1.BadRequestException('秒杀活动未开始或已结束');
        }
        if (flashSale.soldCount >= flashSale.quantity) {
            throw new common_1.BadRequestException('秒杀商品已售罄');
        }
        const userParticipatedKey = `flashsale:${flashSaleId}:user:${userId}`;
        const hasParticipated = await this.redis.get(userParticipatedKey);
        if (hasParticipated && parseInt(hasParticipated) >= flashSale.limitPerUser) {
            throw new common_1.BadRequestException('已达到每人限购数量');
        }
        const stockKey = `flashsale:${flashSaleId}:stock`;
        const result = await this.redis.decr(stockKey);
        if (result < 0) {
            await this.redis.incr(stockKey);
            throw new common_1.BadRequestException('秒杀商品已售罄');
        }
        await this.redis.incr(userParticipatedKey);
        flashSale.soldCount += 1;
        await this.flashSaleRepository.save(flashSale);
        return true;
    }
    async initFlashSaleStock(flashSaleId) {
        const flashSale = await this.flashSaleRepository.findOne({
            where: { id: Number(flashSaleId) }
        });
        if (!flashSale) {
            throw new common_1.NotFoundException(`秒杀活动 ID ${flashSaleId} 不存在`);
        }
        const stockKey = `flashsale:${flashSaleId}:stock`;
        await this.redis.set(stockKey, flashSale.quantity - flashSale.soldCount);
        const endTimeMs = flashSale.endTime.getTime();
        const now = Date.now();
        const ttl = Math.max(0, endTimeMs - now) + 3600000;
        await this.redis.expire(stockKey, Math.floor(ttl / 1000));
        return;
    }
    async getFlashSaleDetail(flashSaleId) {
        const flashSale = await this.flashSaleRepository.findOne({
            where: { id: Number(flashSaleId) },
            relations: ['product']
        });
        if (!flashSale) {
            throw new common_1.NotFoundException(`秒杀活动 ID ${flashSaleId} 不存在`);
        }
        const stockKey = `flashsale:${flashSaleId}:stock`;
        const stockInRedis = await this.redis.get(stockKey);
        if (stockInRedis !== null) {
            const availableStock = parseInt(stockInRedis);
            flashSale.soldCount = Math.max(0, flashSale.quantity - availableStock);
        }
        return flashSale;
    }
    async createFlashSale(createFlashSaleDto) {
        const product = await this.productRepository.findOne({
            where: { id: Number(createFlashSaleDto.productId) }
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${createFlashSaleDto.productId} not found`);
        }
        if (createFlashSaleDto.flashPrice > product.price) {
            throw new common_1.BadRequestException('秒杀价格不能高于原价');
        }
        if (createFlashSaleDto.quantity > product.stock) {
            throw new common_1.BadRequestException('秒杀数量不能超过商品库存');
        }
        const flashSale = this.flashSaleRepository.create(Object.assign(Object.assign({}, createFlashSaleDto), { status: flash_sale_entity_1.FlashSaleStatus.PENDING, soldCount: 0 }));
        const savedFlashSale = await this.flashSaleRepository.save(flashSale);
        const now = new Date();
        if (flashSale.startTime <= now && flashSale.endTime > now) {
            await this.initFlashSaleStock(savedFlashSale.id);
            savedFlashSale.status = flash_sale_entity_1.FlashSaleStatus.ACTIVE;
            await this.flashSaleRepository.save(savedFlashSale);
        }
        return savedFlashSale;
    }
};
exports.PromotionService = PromotionService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PromotionService.prototype, "updatePromotionStatus", null);
exports.PromotionService = PromotionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promotion_entity_1.Promotion)),
    __param(1, (0, typeorm_1.InjectRepository)(flash_sale_entity_1.FlashSale)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(3, (0, ioredis_1.InjectRedis)()),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository, typeof (_a = typeof ioredis_1.Redis !== "undefined" && ioredis_1.Redis) === "function" ? _a : Object])
], PromotionService);
//# sourceMappingURL=promotion.service.js.map