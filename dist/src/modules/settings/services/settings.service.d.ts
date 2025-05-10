import { Repository } from "typeorm";
import { Setting } from "../entities/setting.entity";
export declare class SettingsService {
    private readonly settingRepository;
    constructor(settingRepository: Repository<Setting>);
    getAll(): Promise<Setting[]>;
    getByKey(key: string): Promise<Setting | undefined>;
    getByGroup(group: string): Promise<Setting[]>;
    update(dto: {
        key: string;
        value: string;
        description?: string;
        group?: string;
        formSchema?: any;
    }): Promise<Setting>;
    getFormSchema(key: string): Promise<any>;
}
