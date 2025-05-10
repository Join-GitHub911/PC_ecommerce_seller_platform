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
exports.OperationAuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const operation_audit_entity_1 = require("../entities/operation-audit.entity");
let OperationAuditService = class OperationAuditService {
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async record(userId, action, detail, ip) {
        const audit = this.auditRepository.create({ userId, action, detail, ip });
        return this.auditRepository.save(audit);
    }
    async findAll(page = 1, limit = 20) {
        const [items, total] = await this.auditRepository.findAndCount({
            order: { createdAt: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { items, total, page, limit };
    }
};
exports.OperationAuditService = OperationAuditService;
exports.OperationAuditService = OperationAuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(operation_audit_entity_1.OperationAudit)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OperationAuditService);
//# sourceMappingURL=operation-audit.service.js.map