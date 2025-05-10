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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_service_1 = require("./category.service");
let ProductService = class ProductService {
    constructor(productRepository, categoryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
    }
    async create(createProductDto) {
        await this.categoryService.findById(createProductDto.categoryId);
        const product = new product_entity_1.Product();
        Object.assign(product, createProductDto);
        if (createProductDto.images) {
            product.images = createProductDto.images.map((image) => (Object.assign(Object.assign({}, image), { productId: undefined })));
        }
        if (createProductDto.specifications) {
            product.specifications = createProductDto.specifications.map((spec) => (Object.assign(Object.assign({}, spec), { productId: undefined })));
        }
        return this.productRepository.save(product);
    }
    async findAll(page = 1, limit = 10, category, keyword) {
        const query = this.productRepository.createQueryBuilder("product");
        if (category) {
            query.andWhere("product.category = :category", { category });
        }
        if (keyword) {
            query.andWhere("product.name LIKE :keyword", { keyword: `%${keyword}%` });
        }
        const [items, total] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return { items, total };
    }
    async findById(id) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException("商品不存在");
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findById(id);
        if (updateProductDto.categoryId) {
            await this.categoryService.findById(updateProductDto.categoryId);
        }
        if (updateProductDto.images) {
            product.images = updateProductDto.images.map((image) => (Object.assign(Object.assign({}, image), { productId: product.id })));
        }
        if (updateProductDto.specifications) {
            product.specifications = updateProductDto.specifications.map((spec) => (Object.assign(Object.assign({}, spec), { productId: product.id })));
        }
        Object.assign(product, updateProductDto);
        return this.productRepository.save(product);
    }
    async updateStock(id, quantity) {
        const product = await this.findById(id);
        product.stock += quantity;
        if (product.stock < 0) {
            throw new Error("库存不足");
        }
        await this.productRepository.save(product);
    }
    async delete(id) {
        const product = await this.findById(id);
        await this.productRepository.remove(product);
    }
    async updateSpecPrices(productId, specPrices) {
        const product = await this.findById(productId);
        product.specPrices = specPrices;
        return this.productRepository.save(product);
    }
    async updateWarehouseStocks(productId, warehouseStocks) {
        const product = await this.findById(productId);
        product.warehouseStocks = warehouseStocks;
        return this.productRepository.save(product);
    }
    async autoOnOffSale() {
        const now = new Date();
        await this.productRepository.update({
            autoOnSaleAt: (0, typeorm_2.LessThanOrEqual)(now),
            isActive: false,
        }, { isActive: true });
        await this.productRepository.update({
            autoOffSaleAt: (0, typeorm_2.LessThanOrEqual)(now),
            isActive: true,
        }, { isActive: false });
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        category_service_1.CategoryService])
], ProductService);
//# sourceMappingURL=product.service.js.map