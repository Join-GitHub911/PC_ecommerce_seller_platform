import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class OrderStatusGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
