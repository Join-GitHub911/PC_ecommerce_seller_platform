import { OperationAuditService } from "../services/operation-audit.service";
export declare class OperationAuditController {
    private readonly auditService;
    constructor(auditService: OperationAuditService);
    findAll(page?: number, limit?: number): Promise<{
        items: import("../entities/operation-audit.entity").OperationAudit[];
        total: number;
        page: number;
        limit: number;
    }>;
}
