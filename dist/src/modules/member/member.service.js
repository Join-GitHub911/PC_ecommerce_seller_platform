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
exports.MemberService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const member_level_entity_1 = require("./entities/member-level.entity");
const user_points_entity_1 = require("./entities/user-points.entity");
const user_entity_1 = require("../user/entities/user.entity");
let MemberService = class MemberService {
    constructor(memberLevelRepository, userPointsRepository, userRepository) {
        this.memberLevelRepository = memberLevelRepository;
        this.userPointsRepository = userPointsRepository;
        this.userRepository = userRepository;
    }
    async getUserTotalPoints(userId) {
        const result = await this.userPointsRepository
            .createQueryBuilder('points')
            .select('SUM(points.points)', 'total')
            .where('points.userId = :userId', { userId })
            .andWhere('points.expiryDate IS NULL OR points.expiryDate > :now', { now: new Date() })
            .getRawOne();
        return result.total ? Number(result.total) : 0;
    }
    async getUserLevel(userId) {
        const totalPoints = await this.getUserTotalPoints(userId);
        const level = await this.memberLevelRepository.findOne({
            where: { requiredPoints: (0, typeorm_2.LessThan)(totalPoints), isActive: true },
            order: { level: 'DESC' }
        });
        return level || await this.memberLevelRepository.findOne({ where: { level: 1 } });
    }
    async addPoints(userId, points, actionType, description, referenceId, expiryDate) {
        const pointsRecord = this.userPointsRepository.create({
            userId,
            points,
            actionType,
            description,
            referenceId,
            expiryDate
        });
        const savedRecord = await this.userPointsRepository.save(pointsRecord);
        await this.updateUserMemberLevel(userId);
        return savedRecord;
    }
    async usePoints(userId, points, description, referenceId) {
        const availablePoints = await this.getUserTotalPoints(userId);
        if (availablePoints < points) {
            return false;
        }
        await this.addPoints(userId, -points, user_points_entity_1.PointsActionType.REDEMPTION, description, referenceId);
        return true;
    }
    async addPointsForPurchase(order) {
        const userLevel = await this.getUserLevel(order.userId);
        const pointsToAdd = Math.floor(Number(order.actualAmount) * userLevel.pointsMultiplier);
        if (pointsToAdd > 0) {
            const expiryDate = new Date();
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            await this.addPoints(order.userId, pointsToAdd, user_points_entity_1.PointsActionType.PURCHASE, `订单${order.orderNo}购物奖励`, order.id.toString(), expiryDate);
        }
    }
    async addPointsForReview(userId, reviewId) {
        await this.addPoints(userId, 5, user_points_entity_1.PointsActionType.REVIEW, '商品评价奖励', reviewId.toString());
    }
    async addPointsForSignIn(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const existingSignIn = await this.userPointsRepository.findOne({
            where: {
                userId,
                actionType: user_points_entity_1.PointsActionType.SIGN_IN,
                createdAt: (0, typeorm_2.Between)(today, tomorrow)
            }
        });
        if (existingSignIn) {
            return false;
        }
        await this.addPoints(userId, 1, user_points_entity_1.PointsActionType.SIGN_IN, '每日签到奖励');
        return true;
    }
    async updateUserMemberLevel(userId) {
        const user = await this.userRepository.findOne({ where: { id: Number(userId) } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const userLevel = await this.getUserLevel(userId);
        user.memberLevelId = userLevel.id;
        return this.userRepository.save(user);
    }
    async getUserPointsHistory(userId, page = 1, limit = 10) {
        const [records, total] = await this.userPointsRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit
        });
        return { records, total };
    }
    async getAllMemberLevels() {
        return this.memberLevelRepository.find({
            where: { isActive: true },
            order: { requiredPoints: 'ASC' }
        });
    }
};
exports.MemberService = MemberService;
exports.MemberService = MemberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(member_level_entity_1.MemberLevel)),
    __param(1, (0, typeorm_1.InjectRepository)(user_points_entity_1.UserPoints)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MemberService);
//# sourceMappingURL=member.service.js.map