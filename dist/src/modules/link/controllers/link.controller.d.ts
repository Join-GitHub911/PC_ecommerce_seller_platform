import { LinkService } from "../services/link.service";
export declare class LinkController {
    private readonly linkService;
    constructor(linkService: LinkService);
    findAll(): Promise<import("../entities/link.entity").Link[]>;
    create(body: {
        name: string;
        url: string;
        logo?: string;
        sort?: number;
    }): Promise<import("../entities/link.entity").Link>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
