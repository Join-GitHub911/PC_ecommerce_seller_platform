import { User } from './User';
export declare class Address {
    id: string;
    userId: string;
    user: User;
    receiver: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
    isDefault: boolean;
}
