import { FileService } from "../services/file.service";
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    uploadFile(file: any): Promise<{
        url: string;
        id: string;
    }>;
}
