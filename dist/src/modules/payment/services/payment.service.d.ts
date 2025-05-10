import { Repository } from "typeorm";
import { Payment, PaymentStatus, PaymentMethod } from "../entities/payment.entity";
import { CreatePaymentDto } from "../dto/create-payment.dto";
import { OrderService } from "../../order/services/order.service";
import { ConfigService } from "@nestjs/config";
import { AlipayService } from "./providers/alipay.service";
import { WechatPayService } from "./providers/wechat-pay.service";
import { UnionPayService } from "./providers/union-pay.service";
export declare class PaymentService {
    private readonly paymentRepository;
    private readonly orderService;
    private readonly configService;
    private readonly alipayService;
    private readonly wechatPayService;
    private readonly unionPayService;
    constructor(paymentRepository: Repository<Payment>, orderService: OrderService, configService: ConfigService, alipayService: AlipayService, wechatPayService: WechatPayService, unionPayService: UnionPayService);
    createPayment(dto: CreatePaymentDto): Promise<Payment>;
    handlePaymentCallback(method: PaymentMethod, payload: any): Promise<void>;
    refund(paymentId: string, amount: number, reason: string): Promise<Payment>;
    findById(id: string): Promise<Payment>;
    queryPaymentStatus(id: string): Promise<PaymentStatus>;
}
