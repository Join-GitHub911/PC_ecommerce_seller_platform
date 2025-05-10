import { PaymentService } from "../../services/PaymentService";
import { PaymentMethodEntity } from "../../entities/payment-method.entity";
import { CreatePaymentDto } from "../../types/payment.type";
interface RequestWithUser {
    user: {
        id: string;
        cart: any;
    };
}
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(createPaymentDto: CreatePaymentDto, user: RequestWithUser["user"]): Promise<import("../../entities/payment.entity").Payment & import("../../entities/payment.entity").Payment[]>;
    getPayment(id: string): Promise<import("../../entities/payment.entity").Payment>;
    getPaymentMethods(): Promise<PaymentMethodEntity[]>;
}
export {};
