import { Repository } from "typeorm";
import { Review } from "../entities/review.entity";
import { CreateReviewDto } from "../dto/create-review.dto";
import { ReplyReviewDto } from "../dto/reply-review.dto";
import { OrderService } from "../../order/services/order.service";
import { ProductService } from "../../product/services/product.service";
import { Order } from "../../order/entities/order.entity";
export declare class ReviewService {
    private readonly reviewRepository;
    private readonly orderService;
    private readonly productService;
    constructor(reviewRepository: Repository<Review>, orderService: OrderService, productService: ProductService);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<Review>;
    findByProduct(productId: string, options: {
        page?: number;
        limit?: number;
        rating?: number;
        hasImages?: boolean;
    }): Promise<[Review[], number]>;
    findByUser(userId: string, page?: number, limit?: number): Promise<[Review[], number]>;
    reply(id: string, replyDto: ReplyReviewDto): Promise<Review>;
    findById(id: string): Promise<Review>;
    delete(id: string, userId: string): Promise<void>;
    hasOrderReview(orderId: string): Promise<boolean>;
    createAutoReview(order: Order): Promise<void>;
}
