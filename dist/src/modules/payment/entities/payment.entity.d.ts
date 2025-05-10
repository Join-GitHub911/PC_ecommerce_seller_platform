import { User } from '../../user/entities/user.entity';
import { Order } from '../../order/entities/order.entity';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentChannel } from '../enums/payment-channel.enum';
export declare class Payment {
    id: number;
    paymentNo: string;
    orderId: number;
    order: Order;
    userId: number;
    user: User;
    amount: number;
    method: PaymentMethod;
    channel: PaymentChannel;
    status: PaymentStatus;
    transactionId: string;
    paidAmount: number;
    paidAt: Date;
    rawData: string;
    refundData: string;
    createdAt: Date;
    updatedAt: Date;
}
