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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Product_1 = require("@/entities/Product");
const InventoryLock_1 = require("@/entities/InventoryLock");
const Order_1 = require("@/entities/Order");
const bad_request_exception_1 = require("../exceptions/bad-request.exception");
const logger_1 = require("../utils/logger");
let InventoryService = class InventoryService {
    constructor(productRepository, inventoryLockRepository, orderRepository, connection) {
        this.productRepository = productRepository;
        this.inventoryLockRepository = inventoryLockRepository;
        this.orderRepository = orderRepository;
        this.connection = connection;
    }
    async lockInventory(orderId) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const order = await this.orderRepository.findOne({
                where: { id: orderId },
                relations: ["items"],
            });
            if (!order) {
                throw new bad_request_exception_1.BadRequestException("订单不存在");
            }
            for (const item of order.items) {
                const product = await queryRunner.manager.findOne(Product_1.Product, {
                    where: { id: item.productId },
                    lock: { mode: "pessimistic_write" },
                });
                if (!product) {
                    throw new bad_request_exception_1.BadRequestException(`商品 ${item.productId} 不存在`);
                }
                if (product.stock < item.quantity) {
                    throw new bad_request_exception_1.BadRequestException(`商品 ${product.name} 库存不足`);
                }
                await queryRunner.manager.save(InventoryLock_1.InventoryLock, {
                    orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    lockTime: new Date(),
                });
                await queryRunner.manager.update(Product_1.Product, { id: item.productId }, {
                    availableStock: () => `available_stock - ${item.quantity}`,
                });
            }
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.logger.error("Failed to lock inventory", { error, orderId });
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async releaseInventory(orderId) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const locks = await this.inventoryLockRepository.find({
                where: { orderId },
            });
            for (const lock of locks) {
                await queryRunner.manager.update(Product_1.Product, { id: lock.productId }, {
                    availableStock: () => `available_stock + ${lock.quantity}`,
                });
            }
            await queryRunner.manager.delete(InventoryLock_1.InventoryLock, { orderId });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.logger.error("Failed to release inventory", { error, orderId });
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async deductInventory(orderId) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const locks = await this.inventoryLockRepository.find({
                where: { orderId },
            });
            for (const lock of locks) {
                await queryRunner.manager.update(Product_1.Product, { id: lock.productId }, {
                    stock: () => `stock - ${lock.quantity}`,
                });
            }
            await queryRunner.manager.delete(InventoryLock_1.InventoryLock, { orderId });
            await queryRunner.commitTransaction();
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            logger_1.logger.error("Failed to deduct inventory", { error, orderId });
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async checkInventory(items) {
        const productIds = items.map((item) => item.productId);
        const products = await this.productRepository.findByIds(productIds);
        const productMap = new Map(products.map((p) => [p.id, p]));
        const insufficientItems = [];
        for (const item of items) {
            const product = productMap.get(item.productId);
            if (!product || product.availableStock < item.quantity) {
                insufficientItems.push({
                    productId: item.productId,
                    productName: (product === null || product === void 0 ? void 0 : product.name) || "未知商品",
                    requestedQuantity: item.quantity,
                    availableQuantity: (product === null || product === void 0 ? void 0 : product.availableStock) || 0,
                });
            }
        }
        return {
            isAvailable: insufficientItems.length === 0,
            insufficientItems,
        };
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Product_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(InventoryLock_1.InventoryLock)),
    __param(2, (0, typeorm_1.InjectRepository)(Order_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Connection])
], InventoryService);
//# sourceMappingURL=InventoryService.js.map