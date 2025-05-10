import { Product } from '../../product/entities/product.entity';
export declare enum FlashSaleStatus {
    PENDING = "pending",
    ACTIVE = "active",
    ENDED = "ended",
    CANCELED = "canceled"
}
export declare class FlashSale {
    id: number;
    title: string;
    description: string;
    productId: number;
    product: Product;
    flashPrice: number;
    quantity: number;
    soldCount: number;
    startTime: Date;
    endTime: Date;
    status: FlashSaleStatus;
    limitPerUser: number;
    createdAt: Date;
    updatedAt: Date;
}
