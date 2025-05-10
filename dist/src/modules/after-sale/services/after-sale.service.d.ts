import { Repository } from "typeorm";
import { AfterSale, AfterSaleStatus } from "../entities/after-sale.entity";
import { CreateAfterSaleDto } from "../dto/create-after-sale.dto";
import { OrderService } from "../../order/services/order.service";
import { I18nService } from "nestjs-i18n";
export declare class AfterSaleService {
    private readonly afterSaleRepository;
    private readonly orderService;
    private readonly i18n;
    constructor(afterSaleRepository: Repository<AfterSale>, orderService: OrderService, i18n: I18nService);
    create(userId: string, dto: CreateAfterSaleDto): Promise<AfterSale>;
    getUserAfterSales(userId: string, page?: number, limit?: number): Promise<{
        items: AfterSale[];
        total: number;
        page: number;
        limit: number;
    }>;
    getById(id: string, userId: string): Promise<AfterSale>;
    adminProcess(id: string, status: AfterSaleStatus, adminRemark?: string): Promise<AfterSale>;
    getStatusText(status: string, lang?: string): Promise<string>;
    updateProgress(afterSaleId: string, status: AfterSaleStatus, remark?: string): Promise<AfterSale>;
    commentAfterSale(afterSaleId: string, userId: string, comment: string): Promise<AfterSale>;
    getProgress(afterSaleId: string, userId: string): Promise<{
        status: string;
        time: Date;
        remark?: string;
    }[]>;
}
