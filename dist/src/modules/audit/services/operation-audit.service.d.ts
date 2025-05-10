import { Repository } from "typeorm";
import { OperationAudit } from "../entities/operation-audit.entity";
export declare class OperationAuditService {
    private readonly auditRepository;
    constructor(auditRepository: Repository<OperationAudit>);
    record(userId: string, action: string, detail: string, ip?: string): Promise<OperationAudit>;
    findAll(page?: number, limit?: number): Promise<{
        items: OperationAudit[];
        total: number;
        page: number;
        limit: number;
    }>;
}
