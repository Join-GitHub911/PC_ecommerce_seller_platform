import { Repository } from "typeorm";
import { Order } from "@/entities/order.entity";
import { OrderItem } from "@/entities/order-item.entity";
import { Cart } from "@/entities/cart.entity";
import { Product } from "@/entities/product.entity";
import { OrderStateManager } from "@/services/OrderStateManager";
import { OrderExceptionHandler } from "@/services/OrderExceptionHandler";
import { Payment } from "@/entities/payment.entity";
import { ConfigService } from "@nestjs/config";
import { AlipayService } from "@/services/payment/AlipayService";
import { WechatPayService } from "@/services/payment/WechatPayService";
import { NotificationService } from "@/services/NotificationService";
import { PaymentMethodEntity } from "@/entities/payment-method.entity";
export declare class PaymentCallbackController {
    private orderRepository;
    private orderItemRepository;
    private cartRepository;
    private productRepository;
    private orderStateManager;
    private exceptionHandler;
    private paymentRepository;
    private configService;
    private alipayService;
    private wechatPayService;
    private notificationService;
    private paymentMethodRepository;
    private orderService;
    private paymentService;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, cartRepository: Repository<Cart>, productRepository: Repository<Product>, orderStateManager: OrderStateManager, exceptionHandler: OrderExceptionHandler, paymentRepository: Repository<Payment>, configService: ConfigService, alipayService: AlipayService, wechatPayService: WechatPayService, notificationService: NotificationService, paymentMethodRepository: Repository<PaymentMethodEntity>);
    handleAlipayCallback(data: any, signature: string): Promise<string>;
    handleWechatCallback(data: any): Promise<{
        return_code: string;
        return_msg: string;
    }>;
    private handlePaymentResult;
}
