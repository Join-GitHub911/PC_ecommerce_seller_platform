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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AfterSaleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const after_sale_service_1 = require("../services/after-sale.service");
const create_after_sale_dto_1 = require("../dto/create-after-sale.dto");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../../shared/decorators/roles.decorator");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_entity_1 = require("@/modules/user/entities/user.entity");
const nestjs_i18n_1 = require("nestjs-i18n");
let AfterSaleController = class AfterSaleController {
    constructor(afterSaleService) {
        this.afterSaleService = afterSaleService;
    }
    async create(user, dto) {
        return this.afterSaleService.create(user.id, dto);
    }
    async getUserAfterSales(user, page, limit) {
        return this.afterSaleService.getUserAfterSales(user.id, page, limit);
    }
    async getAfterSale(id, i18n) {
        const as = await this.afterSaleService.getById(id);
        if (!as) {
            throw new common_1.NotFoundException(await i18n.t("AFTER_SALE.NOT_FOUND"));
        }
        return as;
    }
    async adminProcess(id, body) {
        return this.afterSaleService.adminProcess(id, body.status, body.adminRemark);
    }
    async updateProgress(id, body) {
        return this.afterSaleService.updateProgress(id, body.status, body.remark);
    }
    async commentAfterSale(id, user, comment) {
        return this.afterSaleService.commentAfterSale(id, user.id, comment);
    }
    async getProgress(id, user) {
        return this.afterSaleService.getProgress(id, user.id);
    }
};
exports.AfterSaleController = AfterSaleController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "申请售后（支持多次）" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object, create_after_sale_dto_1.CreateAfterSaleDto]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "获取我的售后工单" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _b : Object, Number, Number]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "getUserAfterSales", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "获取售后工单详情" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "getAfterSale", null);
__decorate([
    (0, common_1.Patch)(":id/process"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)("admin"),
    (0, swagger_1.ApiOperation)({ summary: "管理员处理售后工单" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "adminProcess", null);
__decorate([
    (0, common_1.Patch)(":id/progress"),
    (0, swagger_1.ApiOperation)({ summary: "更新售后进度（管理员/系统）" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "updateProgress", null);
__decorate([
    (0, common_1.Patch)(":id/comment"),
    (0, swagger_1.ApiOperation)({ summary: "售后评价" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)("comment")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_c = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _c : Object, String]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "commentAfterSale", null);
__decorate([
    (0, common_1.Get)(":id/progress"),
    (0, swagger_1.ApiOperation)({ summary: "获取售后进度" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AfterSaleController.prototype, "getProgress", null);
exports.AfterSaleController = AfterSaleController = __decorate([
    (0, swagger_1.ApiTags)("after-sale"),
    (0, common_1.Controller)("after-sale"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [after_sale_service_1.AfterSaleService])
], AfterSaleController);
//# sourceMappingURL=after-sale.controller.js.map