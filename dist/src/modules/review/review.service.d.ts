import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from '../user/entities/user.entity';
import { OrderService } from '../order/order.service';
export declare class ReviewService {
    private reviewRepository;
    private orderService;
    constructor(reviewRepository: Repository<Review>, orderService: OrderService);
    create(user: User, createReviewDto: CreateReviewDto): Promise<Review>;
    findByProduct(productId: number, page?: number, limit?: number): Promise<{
        reviews: Review[];
        total: number;
    }>;
    findByUser(userId: number, page?: number, limit?: number): Promise<{
        reviews: Review[];
        total: number;
    }>;
    addAdminReply(reviewId: number, reply: string): Promise<Review>;
    getProductRatingSummary(productId: number): Promise<any>;
}
