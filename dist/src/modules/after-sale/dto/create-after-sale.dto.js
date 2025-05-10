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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAfterSaleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateAfterSaleDto {
}
exports.CreateAfterSaleDto = CreateAfterSaleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "订单ID" }),
    __metadata("design:type", String)
], CreateAfterSaleDto.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "售后类型" }),
    __metadata("design:type", String)
], CreateAfterSaleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "售后原因" }),
    __metadata("design:type", String)
], CreateAfterSaleDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "退款金额" }),
    __metadata("design:type", Number)
], CreateAfterSaleDto.prototype, "refundAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "备注" }),
    __metadata("design:type", String)
], CreateAfterSaleDto.prototype, "remark", void 0);
//# sourceMappingURL=create-after-sale.dto.js.map