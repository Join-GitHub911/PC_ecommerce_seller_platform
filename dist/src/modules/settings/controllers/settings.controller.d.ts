import { SettingsService } from "../services/settings.service";
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(): Promise<import("../entities/setting.entity").Setting[]>;
    getByGroup(group: string): Promise<import("../entities/setting.entity").Setting[]>;
    update(dto: {
        key: string;
        value: string;
        description?: string;
        group?: string;
        formSchema?: any;
    }): Promise<import("../entities/setting.entity").Setting>;
    getFormSchema(key: string): Promise<any>;
}
