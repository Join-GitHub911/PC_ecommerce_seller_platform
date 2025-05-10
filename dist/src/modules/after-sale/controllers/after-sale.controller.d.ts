import { AfterSaleService } from "../services/after-sale.service";
import { CreateAfterSaleDto } from "../dto/create-after-sale.dto";
import { User } from "@/modules/user/entities/user.entity";
import { AfterSaleStatus } from "../entities/after-sale.entity";
import { I18nContext } from "nestjs-i18n";
export declare class AfterSaleController {
    private readonly afterSaleService;
    constructor(afterSaleService: AfterSaleService);
    create(user: User, dto: CreateAfterSaleDto): Promise<import("../entities/after-sale.entity").AfterSale>;
    getUserAfterSales(user: User, page?: number, limit?: number): Promise<{
        items: import("../entities/after-sale.entity").AfterSale[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAfterSale(id: string, i18n: I18nContext): Promise<import("../entities/after-sale.entity").AfterSale>;
    adminProcess(id: string, body: {
        status: AfterSaleStatus;
        adminRemark?: string;
    }): Promise<import("../entities/after-sale.entity").AfterSale>;
    updateProgress(id: string, body: {
        status: string;
        remark?: string;
    }): Promise<import("../entities/after-sale.entity").AfterSale>;
    commentAfterSale(id: string, user: User, comment: string): Promise<import("../entities/after-sale.entity").AfterSale>;
    getProgress(id: string, user: User): Promise<{
        status: string;
        time: Date;
        remark?: string;
    }[]>;
}
