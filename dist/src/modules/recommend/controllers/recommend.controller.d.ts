import { RecommendService } from "../services/recommend.service";
import { User } from "@/modules/user/entities/user.entity";
export declare class RecommendController {
    private readonly recommendService;
    constructor(recommendService: RecommendService);
    guessYouLike(user: User): Promise<import("../../product/entities/product.entity").Product[]>;
}
