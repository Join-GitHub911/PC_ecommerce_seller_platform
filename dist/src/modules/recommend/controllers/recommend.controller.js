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
exports.RecommendController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const recommend_service_1 = require("../services/recommend.service");
const jwt_auth_guard_1 = require("../../../shared/guards/jwt-auth.guard");
const user_decorator_1 = require("../../../shared/decorators/user.decorator");
const user_entity_1 = require("@/modules/user/entities/user.entity");
let RecommendController = class RecommendController {
    constructor(recommendService) {
        this.recommendService = recommendService;
    }
    async guessYouLike(user) {
        return this.recommendService.guessYouLike(user);
    }
};
exports.RecommendController = RecommendController;
__decorate([
    (0, common_1.Get)("guess-you-like"),
    (0, swagger_1.ApiOperation)({ summary: "猜你喜欢" }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof user_entity_1.User !== "undefined" && user_entity_1.User) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], RecommendController.prototype, "guessYouLike", null);
exports.RecommendController = RecommendController = __decorate([
    (0, swagger_1.ApiTags)("recommend"),
    (0, common_1.Controller)("recommend"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [recommend_service_1.RecommendService])
], RecommendController);
//# sourceMappingURL=recommend.controller.js.map