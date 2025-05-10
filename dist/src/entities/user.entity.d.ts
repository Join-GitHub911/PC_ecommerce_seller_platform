import { Address } from './address.entity';
import { Order } from './order.entity';
import { Cart } from './cart.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    phone?: string;
    wechatOpenId?: string;
    isVerified: boolean;
    realName?: string;
    idCard?: string;
    isBlacklisted: boolean;
    tags?: string[];
    profile?: Record<string, any>;
    roles: string[];
    permissions: string[];
    addresses: Address[];
    orders: Order[];
    carts: Cart[];
    createdAt: Date;
    updatedAt: Date;
}
