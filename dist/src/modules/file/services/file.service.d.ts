import { Repository } from "typeorm";
import { FileEntity } from "../entities/file.entity";
export declare class FileService {
    private readonly fileRepository;
    constructor(fileRepository: Repository<FileEntity>);
    saveFile(meta: Partial<FileEntity>): Promise<FileEntity>;
    findById(id: string): Promise<FileEntity | undefined>;
}
