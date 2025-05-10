import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { BrowseHistory } from '../user-activity/entities/browse-history.entity';
import { Order } from '../order/entities/order.entity';
import { OrderItem } from '../order/entities/order-item.entity';
export declare class RecommendationService {
    private productRepository;
    private browseHistoryRepository;
    private orderRepository;
    private orderItemRepository;
    private readonly logger;
    constructor(productRepository: Repository<Product>, browseHistoryRepository: Repository<BrowseHistory>, orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>);
    getHotProducts(limit?: number): Promise<Product[]>;
    getPersonalizedRecommendations(userId: number, limit?: number): Promise<Product[]>;
    getSimilarProducts(productId: number, limit?: number): Promise<Product[]>;
    getFrequentlyBoughtTogether(productId: number, limit?: number): Promise<Product[]>;
}
