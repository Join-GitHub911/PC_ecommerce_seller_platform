import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { User } from '../user/entities/user.entity';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    create(user: User, createOrderDto: CreateOrderDto): Promise<import("./entities/order.entity").Order>;
    findAll(user: User): Promise<import("./entities/order.entity").Order[]>;
    findOne(user: User, id: string): Promise<import("./entities/order.entity").Order>;
    cancel(user: User, id: string, reason: string): Promise<import("./entities/order.entity").Order>;
    confirmReceipt(id: string, user: any): Promise<any>;
    applyRefund(id: string, refundDto: any, user: any): Promise<any>;
    getLogistics(id: string, user: any): Promise<any>;
}
