import { Repository } from "typeorm";
import { SystemLog } from "../entities/system-log.entity";
export declare class SystemLogService {
    private readonly logRepository;
    constructor(logRepository: Repository<SystemLog>);
    log(userId: string, action: string, detail: string, ip?: string): Promise<SystemLog>;
    findAll(page?: number, limit?: number): Promise<{
        items: SystemLog[];
        total: number;
        page: number;
        limit: number;
    }>;
}
