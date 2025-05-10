import { Repository } from 'typeorm';
import { MemberLevel } from './entities/member-level.entity';
import { UserPoints, PointsActionType } from './entities/user-points.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';
export declare class MemberService {
    private memberLevelRepository;
    private userPointsRepository;
    private userRepository;
    constructor(memberLevelRepository: Repository<MemberLevel>, userPointsRepository: Repository<UserPoints>, userRepository: Repository<User>);
    getUserTotalPoints(userId: number): Promise<number>;
    getUserLevel(userId: number): Promise<MemberLevel>;
    addPoints(userId: number, points: number, actionType: PointsActionType, description?: string, referenceId?: string, expiryDate?: Date): Promise<UserPoints>;
    usePoints(userId: number, points: number, description: string, referenceId?: string): Promise<boolean>;
    addPointsForPurchase(order: Order): Promise<void>;
    addPointsForReview(userId: number, reviewId: number): Promise<void>;
    addPointsForSignIn(userId: number): Promise<boolean>;
    updateUserMemberLevel(userId: number): Promise<User>;
    getUserPointsHistory(userId: number, page?: number, limit?: number): Promise<{
        records: UserPoints[];
        total: number;
    }>;
    getAllMemberLevels(): Promise<MemberLevel[]>;
}
