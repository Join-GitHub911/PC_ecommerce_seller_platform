import { BackupService } from "../services/backup.service";
export declare class BackupController {
    private readonly backupService;
    constructor(backupService: BackupService);
    createBackup(): Promise<import("../entities/backup-record.entity").BackupRecord>;
    listBackups(): Promise<import("../entities/backup-record.entity").BackupRecord[]>;
    restoreBackup(id: string): Promise<import("../entities/backup-record.entity").BackupRecord>;
}
