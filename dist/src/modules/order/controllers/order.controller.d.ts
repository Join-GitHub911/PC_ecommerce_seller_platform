import { I18nContext } from "nestjs-i18n";
import { OrderService } from "../services/order.service";
import { CreateOrderDto, OrderResponseDto, OrderDetailResponseDto, PaymentResponseDto, OrderQueryParamsDto, OrderListResponseDto, CreatePaymentDto, CreateRefundDto, RefundResponseDto } from "../dto";
import { User } from "../decorators/user.decorator";
import { UserEntity } from "../entities/user.entity";
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder(createOrderDto: CreateOrderDto, user: UserEntity): Promise<OrderResponseDto>;
    getOrderDetail(id: string): Promise<OrderDetailResponseDto>;
    payOrder(id: string, paymentDto: CreatePaymentDto): Promise<PaymentResponseDto>;
    cancelOrder(id: string): Promise<OrderResponseDto>;
    getOrders(queryParams: OrderQueryParamsDto): Promise<OrderListResponseDto>;
    requestRefund(id: string, refundDto: CreateRefundDto): Promise<RefundResponseDto>;
    addRemark(id: string, user: User, remark: string): Promise<any>;
    urgeOrder(id: string, user: User): Promise<any>;
    hello(i18n: I18nContext): unknown;
}
