import { Cart } from './Cart';
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    wechatOpenId: string;
    isVerified: boolean;
    realName: string;
    idCard: string;
    isBlacklisted: boolean;
    tags: string[];
    profile: any;
    carts: Cart[];
    createdAt: Date;
    updatedAt: Date;
}
