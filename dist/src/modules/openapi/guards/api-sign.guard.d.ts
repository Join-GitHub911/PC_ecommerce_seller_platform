import { CanActivate, ExecutionContext } from "@nestjs/common";
import { ApiClientService } from "../services/api-client.service";
export declare class ApiSignGuard implements CanActivate {
    private readonly apiClientService;
    constructor(apiClientService: ApiClientService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
