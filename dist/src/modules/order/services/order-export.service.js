"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderExportService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const Order_1 = require("@/entities/Order");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const date_fns_1 = require("date-fns");
let OrderExportService = class OrderExportService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async exportToExcel(params) {
        const orders = await this.getOrders(params);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Orders");
        worksheet.columns = [
            { header: "订单编号", key: "id", width: 20 },
            { header: "创建时间", key: "createdAt", width: 20 },
            { header: "订单状态", key: "status", width: 15 },
            { header: "商品总数", key: "itemCount", width: 10 },
            { header: "订单金额", key: "finalAmount", width: 15 },
            { header: "收货人", key: "recipient", width: 15 },
            { header: "联系电话", key: "phone", width: 15 },
            { header: "收货地址", key: "address", width: 40 },
        ];
        orders.forEach((order) => {
            worksheet.addRow({
                id: order.id,
                createdAt: (0, date_fns_1.format)(order.createdAt, "yyyy-MM-dd HH:mm:ss"),
                status: this.getStatusText(order.status),
                itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
                finalAmount: order.finalAmount,
                recipient: order.address.recipient,
                phone: order.address.phone,
                address: `${order.address.province}${order.address.city}${order.address.district}${order.address.detail}`,
            });
        });
        worksheet.getRow(1).font = { bold: true };
        worksheet.getColumn("finalAmount").numFmt = "¥#,##0.00";
        return await workbook.xlsx.writeBuffer();
    }
    async exportToPDF(orderId) {
        const order = await this.orderRepository.findOne({
            where: { id: orderId },
            relations: ["items", "address"],
        });
        if (!order) {
            throw new Error("订单不存在");
        }
        const doc = new PDFDocument();
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.fontSize(18).text("订单详情", { align: "center" }).moveDown();
        doc
            .fontSize(12)
            .text(`订单编号：${order.id}`)
            .text(`创建时间：${(0, date_fns_1.format)(order.createdAt, "yyyy-MM-dd HH:mm:ss")}`)
            .text(`订单状态：${this.getStatusText(order.status)}`)
            .moveDown();
        doc
            .text("收货信息")
            .text(`收货人：${order.address.recipient}`)
            .text(`联系电话：${order.address.phone}`)
            .text(`收货地址：${order.address.province}${order.address.city}${order.address.district}${order.address.detail}`)
            .moveDown();
        doc.text("商品信息").moveDown();
        order.items.forEach((item) => {
            doc
                .text(`${item.productName} x ${item.quantity}`)
                .text(`规格：${Object.entries(item.specifications)
                .map(([key, value]) => `${key}:${value}`)
                .join(" ")}`)
                .text(`小计：¥${item.amount.toFixed(2)}`)
                .moveDown();
        });
        doc
            .moveDown()
            .text(`商品总额：¥${order.totalAmount.toFixed(2)}`)
            .text(`运费：¥${order.deliveryFee.toFixed(2)}`);
        if (order.discount) {
            doc.text(`优惠金额：¥${order.discount.toFixed(2)}`);
        }
        doc.text(`实付金额：¥${order.finalAmount.toFixed(2)}`, {
            underline: true,
            bold: true,
        });
        doc.end();
        return Buffer.concat(buffers);
    }
    async getOrders(params) {
        const queryBuilder = this.orderRepository
            .createQueryBuilder("order")
            .leftJoinAndSelect("order.items", "items")
            .leftJoinAndSelect("order.address", "address");
        if (params.startDate) {
            queryBuilder.andWhere("order.createdAt >= :startDate", {
                startDate: params.startDate,
            });
        }
        if (params.endDate) {
            queryBuilder.andWhere("order.createdAt <= :endDate", {
                endDate: params.endDate,
            });
        }
        if (params.status) {
            queryBuilder.andWhere("order.status = :status", {
                status: params.status,
            });
        }
        if (params.userId) {
            queryBuilder.andWhere("order.userId = :userId", {
                userId: params.userId,
            });
        }
        return queryBuilder.orderBy("order.createdAt", "DESC").getMany();
    }
    getStatusText(status) {
        const statusMap = {
            pending_payment: "待付款",
            pending_shipment: "待发货",
            pending_receipt: "待收货",
            completed: "已完成",
            cancelled: "已取消",
        };
        return statusMap[status] || status;
    }
};
exports.OrderExportService = OrderExportService;
exports.OrderExportService = OrderExportService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Order_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderExportService);
//# sourceMappingURL=order-export.service.js.map