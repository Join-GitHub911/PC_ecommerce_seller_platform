import { Repository } from "typeorm";
import { Payment } from "@/entities/payment.entity";
import { Order } from "@/entities/order.entity";
import { PaymentMethodEntity } from "@/entities/payment-method.entity";
import { PaymentStatus, CreatePaymentDto } from "@/types/payment.type";
import { ConfigService } from "@nestjs/config";
import { AlipayService } from "./payment/AlipayService";
import { WechatPayService } from "./payment/WechatPayService";
import { NotificationService } from "./NotificationService";
export declare class PaymentService {
    private paymentRepository;
    private orderRepository;
    private paymentMethodRepository;
    private configService;
    private alipayService;
    private wechatPayService;
    private notificationService;
    constructor(paymentRepository: Repository<Payment>, orderRepository: Repository<Order>, paymentMethodRepository: Repository<PaymentMethodEntity>, configService: ConfigService, alipayService: AlipayService, wechatPayService: WechatPayService, notificationService: NotificationService);
    createPayment(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment & Payment[]>;
    getPayment(id: string): Promise<Payment>;
    getPaymentMethods(): Promise<PaymentMethodEntity[]>;
    private handleBalancePayment;
    getPaymentStatus(orderId: string): Promise<any>;
    refundPayment(params: {
        orderId: string;
        amount: number;
        reason?: string;
    }): Promise<any>;
    updatePayment(params: {
        orderId: string;
        platform: string;
        transactionId: string;
        status: PaymentStatus;
        payTime: string;
        raw: any;
    }): Promise<void>;
}
