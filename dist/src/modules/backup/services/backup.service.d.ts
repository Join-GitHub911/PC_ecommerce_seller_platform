import { Repository } from "typeorm";
import { BackupRecord } from "../entities/backup-record.entity";
export declare class BackupService {
    private readonly backupRepository;
    constructor(backupRepository: Repository<BackupRecord>);
    createBackup(): Promise<BackupRecord>;
    listBackups(): Promise<BackupRecord[]>;
    restoreBackup(id: string): Promise<BackupRecord>;
}
