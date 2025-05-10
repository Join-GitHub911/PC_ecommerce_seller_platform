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
exports.AfterSaleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const after_sale_entity_1 = require("../entities/after-sale.entity");
const order_service_1 = require("../../order/services/order.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const order_1 = require("../../../types/order");
let AfterSaleService = class AfterSaleService {
    constructor(afterSaleRepository, orderService, i18n) {
        this.afterSaleRepository = afterSaleRepository;
        this.orderService = orderService;
        this.i18n = i18n;
    }
    async create(userId, dto) {
        const order = await this.orderService.findById(dto.orderId);
        if (!order || order.userId !== userId)
            throw new common_1.ForbiddenException("无权申请该订单售后");
        if (order.status !== order_1.OrderStatus.COMPLETED)
            throw new common_1.BadRequestException("订单未完成，不能申请售后");
        const last = await this.afterSaleRepository.findOne({
            where: { orderId: dto.orderId, userId },
            order: { createdAt: "DESC" },
        });
        const applyCount = last ? last.applyCount + 1 : 1;
        const afterSale = this.afterSaleRepository.create(Object.assign(Object.assign({}, dto), { userId, type: dto.type, status: after_sale_entity_1.AfterSaleStatus.PENDING, applyCount, progress: [
                {
                    status: after_sale_entity_1.AfterSaleStatus.PENDING.toString(),
                    time: new Date(),
                    remark: "用户提交申请",
                },
            ] }));
        return this.afterSaleRepository.save(afterSale);
    }
    async getUserAfterSales(userId, page = 1, limit = 10) {
        const [items, total] = await this.afterSaleRepository.findAndCount({
            where: { userId },
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }
    async getById(id, userId) {
        const as = await this.afterSaleRepository.findOne({
            where: { id, userId },
        });
        if (!as)
            throw new common_1.NotFoundException("售后工单不存在");
        return as;
    }
    async adminProcess(id, status, adminRemark) {
        const as = await this.afterSaleRepository.findOne({ where: { id } });
        if (!as)
            throw new common_1.NotFoundException("售后工单不存在");
        as.status = status;
        as.adminRemark = adminRemark;
        return this.afterSaleRepository.save(as);
    }
    async getStatusText(status, lang = "zh") {
        return this.i18n.translate(`AFTER_SALE.STATUS.${status}`, { lang });
    }
    async updateProgress(afterSaleId, status, remark) {
        const as = await this.afterSaleRepository.findOne({
            where: { id: afterSaleId },
        });
        if (!as)
            throw new common_1.NotFoundException("售后工单不存在");
        as.status = status;
        as.progress = [
            ...(as.progress || []),
            { status, time: new Date(), remark },
        ];
        return this.afterSaleRepository.save(as);
    }
    async commentAfterSale(afterSaleId, userId, comment) {
        const as = await this.afterSaleRepository.findOne({
            where: { id: afterSaleId, userId },
        });
        if (!as)
            throw new common_1.NotFoundException("售后工单不存在");
        as.userComment = comment;
        return this.afterSaleRepository.save(as);
    }
    async getProgress(afterSaleId, userId) {
        const as = await this.afterSaleRepository.findOne({
            where: { id: afterSaleId, userId },
        });
        if (!as)
            throw new common_1.NotFoundException("售后工单不存在");
        return as.progress || [];
    }
};
exports.AfterSaleService = AfterSaleService;
exports.AfterSaleService = AfterSaleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(after_sale_entity_1.AfterSale)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        order_service_1.OrderService,
        nestjs_i18n_1.I18nService])
], AfterSaleService);
//# sourceMappingURL=after-sale.service.js.map