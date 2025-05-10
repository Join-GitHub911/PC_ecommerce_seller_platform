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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const category_entity_1 = require("./entities/category.entity");
const product_image_entity_1 = require("./entities/product-image.entity");
const product_sku_entity_1 = require("./entities/product-sku.entity");
let ProductService = class ProductService {
    constructor(productRepository, categoryRepository, productImageRepository, productSkuRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productImageRepository = productImageRepository;
        this.productSkuRepository = productSkuRepository;
    }
    async create(createProductDto) {
        const { categoryId, images, skus } = createProductDto, productData = __rest(createProductDto, ["categoryId", "images", "skus"]);
        let category = null;
        if (categoryId) {
            category = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const product = this.productRepository.create(Object.assign(Object.assign({}, productData), { category }));
        const savedProduct = await this.productRepository.save(product);
        if (images && images.length > 0) {
            const productImages = images.map(image => (Object.assign(Object.assign({}, image), { product: savedProduct })));
            await this.productImageRepository.save(productImages);
        }
        if (skus && skus.length > 0) {
            const productSkus = skus.map(sku => (Object.assign(Object.assign({}, sku), { product: savedProduct })));
            await this.productSkuRepository.save(productSkus);
        }
        return this.findOne(savedProduct.id);
    }
    async findAll() {
        return this.productRepository.find({
            relations: ['category', 'images', 'skus'],
        });
    }
    async findOne(id) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category', 'images', 'skus'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.findOne(id);
        const { categoryId, images, skus } = updateProductDto, productData = __rest(updateProductDto, ["categoryId", "images", "skus"]);
        if (categoryId) {
            const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            product.category = category;
        }
        Object.assign(product, productData);
        if (images) {
            await this.productImageRepository.delete({ product: { id } });
            const productImages = images.map(image => (Object.assign(Object.assign({}, image), { product })));
            await this.productImageRepository.save(productImages);
        }
        if (skus) {
            await this.productSkuRepository.delete({ product: { id } });
            const productSkus = skus.map(sku => (Object.assign(Object.assign({}, sku), { product })));
            await this.productSkuRepository.save(productSkus);
        }
        return this.productRepository.save(product);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepository.remove(product);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(product_image_entity_1.ProductImage)),
    __param(3, (0, typeorm_1.InjectRepository)(product_sku_entity_1.ProductSku)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map