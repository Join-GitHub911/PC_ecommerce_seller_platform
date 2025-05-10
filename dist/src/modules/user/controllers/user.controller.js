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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("../services/user.service");
const create_user_dto_1 = require("../dto/create-user.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_entity_1 = require("../entities/user.entity");
const nestjs_i18n_1 = require("nestjs-i18n");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async getProfile(user) {
        return this.userService.findById(user.id);
    }
    async updateProfile(user, updateUserDto) {
        return this.userService.update(user.id, updateUserDto);
    }
    async getUser(id, i18n) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(await i18n.t("USER.NOT_FOUND"));
        }
        return user;
    }
    async verifyUser(user, body) {
        return this.userService.verifyUser(user.id, body.realName, body.idCard);
    }
    async blacklistUser(userId) {
        return this.userService.blacklistUser(userId);
    }
    async removeFromBlacklist(userId) {
        return this.userService.removeFromBlacklist(userId);
    }
    async updateTags(user, tags) {
        return this.userService.updateTags(user.id, tags);
    }
    async updateProfile(user, profile) {
        return this.userService.updateProfile(user.id, profile);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "创建用户" }),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "获取当前用户信息" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "更新当前用户信息" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, typeof (_a = typeof update_user_dto_1.UpdateUserDto !== "undefined" && update_user_dto_1.UpdateUserDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, nestjs_i18n_1.I18n)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, nestjs_i18n_1.I18nContext]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)("verify"),
    (0, swagger_1.ApiOperation)({ summary: "实名认证" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyUser", null);
__decorate([
    (0, common_1.Patch)("blacklist"),
    (0, swagger_1.ApiOperation)({ summary: "加入黑名单（管理员）" }),
    __param(0, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "blacklistUser", null);
__decorate([
    (0, common_1.Patch)("remove-blacklist"),
    (0, swagger_1.ApiOperation)({ summary: "移出黑名单（管理员）" }),
    __param(0, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "removeFromBlacklist", null);
__decorate([
    (0, common_1.Patch)("tags"),
    (0, swagger_1.ApiOperation)({ summary: "更新用户标签" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("tags")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Array]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateTags", null);
__decorate([
    (0, common_1.Patch)("profile"),
    (0, swagger_1.ApiOperation)({ summary: "更新用户画像" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)("profile")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("users"),
    (0, common_1.Controller)("users"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map