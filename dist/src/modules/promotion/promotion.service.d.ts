import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { FlashSale } from './entities/flash-sale.entity';
import { Product } from '../product/entities/product.entity';
import { Redis } from '@nestjs-modules/ioredis';
export declare class PromotionService {
    private promotionRepository;
    private flashSaleRepository;
    private productRepository;
    private readonly redis;
    constructor(promotionRepository: Repository<Promotion>, flashSaleRepository: Repository<FlashSale>, productRepository: Repository<Product>, redis: Redis);
    updatePromotionStatus(): Promise<void>;
    getActivePromotions(): Promise<Promotion[]>;
    getProductPromotions(productId: number): Promise<Promotion[]>;
    getActiveFlashSales(): Promise<FlashSale[]>;
    getUpcomingFlashSales(): Promise<FlashSale[]>;
    participateFlashSale(userId: number, flashSaleId: number): Promise<boolean>;
    initFlashSaleStock(flashSaleId: number): Promise<void>;
    getFlashSaleDetail(flashSaleId: number): Promise<FlashSale>;
    createFlashSale(createFlashSaleDto: any): Promise<FlashSale>;
}
