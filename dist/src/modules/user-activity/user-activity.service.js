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
exports.UserActivityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("./entities/favorite.entity");
const browse_history_entity_1 = require("./entities/browse-history.entity");
let UserActivityService = class UserActivityService {
    constructor(favoriteRepository, browseHistoryRepository) {
        this.favoriteRepository = favoriteRepository;
        this.browseHistoryRepository = browseHistoryRepository;
    }
    async addFavorite(user, productId) {
        const existing = await this.favoriteRepository.findOne({
            where: {
                userId: user.id,
                productId: Number(productId)
            }
        });
        if (existing) {
            return existing;
        }
        const favorite = this.favoriteRepository.create({
            userId: user.id,
            productId: Number(productId)
        });
        return this.favoriteRepository.save(favorite);
    }
    async removeFavorite(user, productId) {
        await this.favoriteRepository.delete({
            userId: user.id,
            productId: Number(productId)
        });
    }
    async getUserFavorites(userId, page = 1, limit = 10) {
        const [favorites, total] = await this.favoriteRepository.findAndCount({
            where: { userId },
            relations: ['product'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { favorites, total };
    }
    async recordProductView(user, productId) {
        let history = await this.browseHistoryRepository.findOne({
            where: {
                userId: user.id,
                productId: Number(productId)
            }
        });
        if (history) {
            history.viewCount += 1;
            history.lastViewedAt = new Date();
            await this.browseHistoryRepository.save(history);
        }
        else {
            history = this.browseHistoryRepository.create({
                userId: user.id,
                productId: Number(productId),
                viewCount: 1
            });
            await this.browseHistoryRepository.save(history);
        }
    }
    async getBrowseHistory(userId, page = 1, limit = 10) {
        const [history, total] = await this.browseHistoryRepository.findAndCount({
            where: { userId },
            relations: ['product'],
            order: { lastViewedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { history, total };
    }
    async clearBrowseHistory(userId) {
        await this.browseHistoryRepository.delete({ userId });
    }
};
exports.UserActivityService = UserActivityService;
exports.UserActivityService = UserActivityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    __param(1, (0, typeorm_1.InjectRepository)(browse_history_entity_1.BrowseHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UserActivityService);
//# sourceMappingURL=user-activity.service.js.map