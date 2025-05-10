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
exports.ApiClientService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const api_client_entity_1 = require("../entities/api-client.entity");
let ApiClientService = class ApiClientService {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }
    async validate(appKey, appSecret) {
        return this.clientRepository.findOne({
            where: { appKey, appSecret, isActive: true },
        });
    }
    async create(name, remark) {
        const appKey = "ak_" + Math.random().toString(36).slice(2, 18);
        const appSecret = "sk_" + Math.random().toString(36).slice(2, 34);
        const client = this.clientRepository.create({
            name,
            appKey,
            appSecret,
            remark,
        });
        return this.clientRepository.save(client);
    }
};
exports.ApiClientService = ApiClientService;
exports.ApiClientService = ApiClientService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(api_client_entity_1.ApiClient)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ApiClientService);
//# sourceMappingURL=api-client.service.js.map