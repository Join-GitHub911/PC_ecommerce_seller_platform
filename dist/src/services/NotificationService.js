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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const logger_util_1 = require("../utils/logger.util");
const nodemailer_1 = require("nodemailer");
const fs_1 = require("fs");
const path_1 = require("path");
const handlebars_1 = require("handlebars");
let NotificationService = class NotificationService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer_1.default.createTransport({
            host: this.configService.get("SMTP_HOST"),
            port: this.configService.get("SMTP_PORT"),
            secure: this.configService.get("SMTP_SECURE"),
            auth: {
                user: this.configService.get("SMTP_USER"),
                pass: this.configService.get("SMTP_PASS"),
            },
        });
        this.loadTemplates();
    }
    loadTemplates() {
        const templatesDir = path_1.default.join(__dirname, "../../templates/email");
        this.templates = {};
        fs_1.default.readdirSync(templatesDir).forEach((file) => {
            const templateName = path_1.default.basename(file, ".hbs");
            const templatePath = path_1.default.join(templatesDir, file);
            const template = fs_1.default.readFileSync(templatePath, "utf8");
            this.templates[templateName] = handlebars_1.default.compile(template);
        });
    }
    async sendPaymentCreatedNotification(params) {
        logger_util_1.logger.log("Payment created notification:", params);
    }
    async sendPaymentSuccessEmail(params) {
        logger_util_1.logger.log("Payment success email:", params);
    }
    async sendPaymentFailedEmail(params) {
        try {
            const { email, orderId, amount, paymentMethod, errorMessage, userName } = params;
            const template = this.templates["payment-failed"];
            const html = template({
                userName,
                orderNo: orderId,
                amount: amount.toFixed(2),
                paymentTime: new Date().toLocaleString(),
                paymentMethod,
                errorMessage,
                paymentUrl: `${this.configService.get("FRONTEND_URL")}/orders/${orderId}/payment`,
                customerService: this.configService.get("CUSTOMER_SERVICE_CONTACT"),
            });
            await this.transporter.sendMail({
                from: this.configService.get("SMTP_FROM"),
                to: email,
                subject: "支付失败通知",
                html,
            });
        }
        catch (error) {
            logger_util_1.logger.error("Failed to send payment failed email", { error, params });
        }
    }
    async sendRefundSuccessEmail(params) {
        logger_util_1.logger.log("Refund success email:", params);
    }
    async sendRefundFailedEmail(params) {
        logger_util_1.logger.log("Refund failed email:", params);
    }
    async sendOrderStatusNotification(orderId, status, reason) {
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], NotificationService);
//# sourceMappingURL=NotificationService.js.map