import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class OrderOwnerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean;
}
