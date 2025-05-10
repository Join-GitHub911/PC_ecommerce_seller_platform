import { Repository } from "typeorm";
import { ApiClient } from "../entities/api-client.entity";
export declare class ApiClientService {
    private readonly clientRepository;
    constructor(clientRepository: Repository<ApiClient>);
    validate(appKey: string, appSecret: string): Promise<ApiClient | null>;
    create(name: string, remark?: string): Promise<ApiClient>;
}
