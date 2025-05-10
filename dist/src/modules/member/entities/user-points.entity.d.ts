import { User } from '../../user/entities/user.entity';
export declare enum PointsActionType {
    PURCHASE = "purchase",
    REVIEW = "review",
    SIGN_IN = "sign_in",
    REFERRAL = "referral",
    ADMINISTRATIVE = "administrative",
    REDEMPTION = "redemption",
    EXPIRE = "expire"
}
export declare class UserPoints {
    id: number;
    userId: number;
    user: User;
    actionType: PointsActionType;
    points: number;
    description: string;
    referenceId: string;
    expiryDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
