import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { OrderService } from "../order.service";
export declare class OrderStatusGuard implements CanActivate {
    private reflector;
    private orderService;
    constructor(reflector: Reflector, orderService: OrderService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export declare class OrderOwnerGuard implements CanActivate {
    private orderService;
    constructor(orderService: OrderService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
