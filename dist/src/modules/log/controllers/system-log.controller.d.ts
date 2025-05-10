import { SystemLogService } from "../services/system-log.service";
export declare class SystemLogController {
    private readonly logService;
    constructor(logService: SystemLogService);
    findAll(page?: number, limit?: number): Promise<{
        items: import("../entities/system-log.entity").SystemLog[];
        total: number;
        page: number;
        limit: number;
    }>;
}
