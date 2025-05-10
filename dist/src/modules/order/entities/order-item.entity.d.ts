import { Order } from './order.entity';
import { Product } from '../../product/entities/product.entity';
import { ProductSku } from '../../product/entities/product-sku.entity';
export declare class OrderItem {
    id: number;
    orderId: number;
    order: Order;
    productId: number;
    product: Product;
    skuId: number;
    sku: ProductSku;
    quantity: number;
    price: number;
    originalPrice: number;
    discountAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
