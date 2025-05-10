import { User } from '@/modules/user/entities/user.entity';
export declare class Address {
    id: string;
    userId: string;
    user: User;
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: Date;
    updatedAt: Date;
}
