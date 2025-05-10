import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentChannel } from './entities/payment.entity';
import { Order } from '../order/entities/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../user/entities/user.entity';
import { AlipayService } from './alipay.service';
import { WechatPayService } from './wechat-pay.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@nestjs-modules/ioredis';
import { OrderService } from '../order/order.service';
import { PaymentResult } from '../../types/payment.types';
import { PaymentMethod } from './enums/payment-method.enum';
export declare class PaymentService {
    private paymentRepository;
    private orderRepository;
    private alipayService;
    private wechatPayService;
    private configService;
    private redisService;
    private orderService;
    private readonly PAYMENT_TIMEOUT;
    private readonly logger;
    private readonly VERIFY_CODE_EXPIRE;
    private readonly PAYMENT_LIMITS;
    constructor(paymentRepository: Repository<Payment>, orderRepository: Repository<Order>, alipayService: AlipayService, wechatPayService: WechatPayService, configService: ConfigService, redisService: RedisService, orderService: OrderService);
    private checkPaymentLimits;
    private checkRiskControl;
    findOne(id: number): Promise<Payment>;
    findByOrderId(orderId: number): Promise<Payment>;
    findByPaymentNo(paymentNo: string): Promise<Payment>;
    verifyAlipayNotify(params: any): Promise<boolean>;
    verifyWechatNotify(params: any, headers: any): Promise<boolean>;
    handleTimeoutPayments(): Promise<void>;
    private generateVerifyCode;
    sendPaymentVerifyCode(user: User, order: Order): Promise<{
        success: boolean;
    }>;
    private verifyPaymentCode;
    create(createPaymentDto: CreatePaymentDto): Promise<Payment>;
    handlePaymentSuccess(payment: Payment): Promise<void>;
    handlePaymentFailure(payment: Payment): Promise<void>;
    refund(payment: Payment, reason: string): Promise<{
        payment: Payment;
        refundData: any;
    }>;
    private generatePaymentNo;
    queryPaymentStatus(payment: Payment): Promise<Payment>;
    cancelPayment(payment: Payment): Promise<Payment>;
    getPaymentHistory(user: User, page?: number, limit?: number): Promise<{
        items: Payment[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    processPayment(orderId: number, channel: PaymentChannel, amount: number): Promise<PaymentResult>;
    private processAlipayPayment;
    private processWechatPayment;
    update(id: number, updateData: {
        status: PaymentStatus;
        transactionId?: string;
        paidAmount?: number;
        paidAt?: string;
        rawData?: string;
    }): Promise<Payment>;
    createPaymentForOrder(order: Order, method: PaymentMethod): Promise<Payment>;
}
