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
var PaymentService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const order_entity_1 = require("../order/entities/order.entity");
const alipay_service_1 = require("./alipay.service");
const wechat_pay_service_1 = require("./wechat-pay.service");
const schedule_1 = require("@nestjs/schedule");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("@nestjs-modules/ioredis");
const order_service_1 = require("../order/order.service");
let PaymentService = PaymentService_1 = class PaymentService {
    constructor(paymentRepository, orderRepository, alipayService, wechatPayService, configService, redisService, orderService) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.alipayService = alipayService;
        this.wechatPayService = wechatPayService;
        this.configService = configService;
        this.redisService = redisService;
        this.orderService = orderService;
        this.PAYMENT_TIMEOUT = 30 * 60 * 1000;
        this.logger = new common_1.Logger(PaymentService_1.name);
        this.VERIFY_CODE_EXPIRE = 5 * 60;
        this.PAYMENT_LIMITS = {
            SINGLE_MAX: 50000,
            DAILY_MAX: 200000,
            HOURLY_MAX: 100000,
        };
    }
    async checkPaymentLimits(user, amount) {
        if (amount > this.PAYMENT_LIMITS.SINGLE_MAX) {
            throw new common_1.BadRequestException(`单笔支付金额不能超过${this.PAYMENT_LIMITS.SINGLE_MAX}元`);
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyPayments = await this.paymentRepository.find({
            where: {
                userId: user.id,
                status: payment_entity_1.PaymentStatus.SUCCESS,
                createdAt: (0, typeorm_2.MoreThanOrEqual)(today),
            },
        });
        const dailyTotal = dailyPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        if (dailyTotal + amount > this.PAYMENT_LIMITS.DAILY_MAX) {
            throw new common_1.BadRequestException(`今日支付金额已超过限额${this.PAYMENT_LIMITS.DAILY_MAX}元`);
        }
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const hourlyPayments = await this.paymentRepository.find({
            where: {
                userId: user.id,
                status: payment_entity_1.PaymentStatus.SUCCESS,
                createdAt: (0, typeorm_2.MoreThanOrEqual)(oneHourAgo),
            },
        });
        const hourlyTotal = hourlyPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        if (hourlyTotal + amount > this.PAYMENT_LIMITS.HOURLY_MAX) {
            throw new common_1.BadRequestException(`每小时支付金额不能超过${this.PAYMENT_LIMITS.HOURLY_MAX}元`);
        }
    }
    async checkRiskControl(user, order) {
        const recentPayments = await this.paymentRepository.count({
            where: {
                userId: user.id,
                status: payment_entity_1.PaymentStatus.SUCCESS,
                createdAt: (0, typeorm_2.MoreThanOrEqual)(new Date(Date.now() - 5 * 60 * 1000)),
            },
        });
        if (recentPayments >= 3) {
            throw new common_1.BadRequestException('支付频率过高，请稍后再试');
        }
        const avgOrderAmount = await this.orderRepository
            .createQueryBuilder('order')
            .select('AVG(order.actualAmount)', 'avgAmount')
            .where('order.userId = :userId', { userId: user.id })
            .andWhere('order.status = :status', { status: order_entity_1.OrderStatus.COMPLETED })
            .getRawOne();
        if (avgOrderAmount && order.actualAmount > avgOrderAmount.avgAmount * 3) {
            this.logger.warn(`高风险订单: 用户 ${user.id} 订单金额异常`);
        }
    }
    async findOne(id) {
        const payment = await this.paymentRepository.findOne({
            where: { id },
            relations: ['order'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return payment;
    }
    async findByOrderId(orderId) {
        const payment = await this.paymentRepository.findOne({
            where: { orderId: Number(orderId) }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment for order ID ${orderId} not found`);
        }
        return payment;
    }
    async findByPaymentNo(paymentNo) {
        const payment = await this.paymentRepository.findOne({
            where: { paymentNo }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with payment number ${paymentNo} not found`);
        }
        return payment;
    }
    async verifyAlipayNotify(params) {
        return this.alipayService.verifyNotify(params);
    }
    async verifyWechatNotify(params, headers) {
        return this.wechatPayService.verifyNotify(params, headers);
    }
    async handleTimeoutPayments() {
        const timeoutDate = new Date(Date.now() - this.PAYMENT_TIMEOUT);
        const timeoutPayments = await this.paymentRepository.find({
            where: {
                status: payment_entity_1.PaymentStatus.PENDING,
                createdAt: (0, typeorm_2.LessThan)(timeoutDate),
            },
            relations: ['order'],
        });
        for (const payment of timeoutPayments) {
            try {
                await this.cancelPayment(payment);
                const order = payment.order;
                order.status = order_entity_1.OrderStatus.CANCELED;
                await this.orderRepository.save(order);
            }
            catch (error) {
                this.logger.error(`Failed to handle timeout payment ${payment.id}:`, error);
            }
        }
    }
    generateVerifyCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    async sendPaymentVerifyCode(user, order) {
        const code = this.generateVerifyCode();
        const key = `payment:verify:${user.id}:${order.id}`;
        await this.redisService.set(key, code, 'EX', this.VERIFY_CODE_EXPIRE);
        this.logger.log(`Payment verify code for user ${user.id}: ${code}`);
        return { success: true };
    }
    async verifyPaymentCode(user, order, code) {
        const key = `payment:verify:${user.id}:${order.id}`;
        const storedCode = await this.redisService.get(key);
        if (!storedCode) {
            throw new common_1.BadRequestException('验证码已过期');
        }
        if (storedCode !== code) {
            throw new common_1.BadRequestException('验证码错误');
        }
        await this.redisService.del(key);
        return true;
    }
    async create(createPaymentDto) {
        const payment = this.paymentRepository.create(Object.assign(Object.assign({}, createPaymentDto), { status: payment_entity_1.PaymentStatus.PENDING, paymentNo: this.generatePaymentNo() }));
        return this.paymentRepository.save(payment);
    }
    async handlePaymentSuccess(payment) {
        payment.status = payment_entity_1.PaymentStatus.SUCCESS;
        await this.paymentRepository.save(payment);
        const order = payment.order;
        order.status = order_entity_1.OrderStatus.PAID;
        order.paidTime = new Date();
        await this.orderRepository.save(order);
    }
    async handlePaymentFailure(payment) {
        payment.status = payment_entity_1.PaymentStatus.FAILED;
        await this.paymentRepository.save(payment);
    }
    async refund(payment, reason) {
        if (payment.status !== payment_entity_1.PaymentStatus.SUCCESS) {
            throw new common_1.BadRequestException('Payment is not successful');
        }
        let refundData;
        switch (payment.channel) {
            case payment_entity_1.PaymentChannel.ALIPAY:
                refundData = await this.alipayService.refund(payment, reason);
                break;
            case payment_entity_1.PaymentChannel.WECHAT:
                refundData = await this.wechatPayService.refund(payment, reason);
                break;
            case payment_entity_1.PaymentChannel.CASH:
                payment.status = payment_entity_1.PaymentStatus.REFUNDED;
                payment.refundData = JSON.stringify({ reason });
                await this.paymentRepository.save(payment);
                return { payment, refundData: null };
            default:
                throw new common_1.BadRequestException('Unsupported payment channel');
        }
        return { payment, refundData };
    }
    generatePaymentNo() {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const random = Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, '0');
        return `P${year}${month}${day}${hours}${minutes}${seconds}${random}`;
    }
    async queryPaymentStatus(payment) {
        if (payment.status !== payment_entity_1.PaymentStatus.PENDING) {
            return payment;
        }
        let result;
        switch (payment.channel) {
            case payment_entity_1.PaymentChannel.ALIPAY:
                result = await this.alipayService.queryPayment(payment);
                break;
            case payment_entity_1.PaymentChannel.WECHAT:
                result = await this.wechatPayService.queryPayment(payment);
                break;
            case payment_entity_1.PaymentChannel.CASH:
                return payment;
            default:
                throw new common_1.BadRequestException('Unsupported payment channel');
        }
        if (result.tradeStatus === 'SUCCESS') {
            await this.handlePaymentSuccess(payment);
        }
        else if (result.tradeStatus === 'CLOSED') {
            await this.handlePaymentFailure(payment);
        }
        return this.findOne(payment.id);
    }
    async cancelPayment(payment) {
        if (payment.status !== payment_entity_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Payment cannot be cancelled');
        }
        let result;
        switch (payment.channel) {
            case payment_entity_1.PaymentChannel.ALIPAY:
                result = await this.alipayService.cancelPayment(payment);
                break;
            case payment_entity_1.PaymentChannel.WECHAT:
                result = await this.wechatPayService.cancelPayment(payment);
                break;
            case payment_entity_1.PaymentChannel.CASH:
                payment.status = payment_entity_1.PaymentStatus.CANCELED;
                await this.paymentRepository.save(payment);
                return payment;
            default:
                throw new common_1.BadRequestException('Unsupported payment channel');
        }
        if (result.success) {
            payment.status = payment_entity_1.PaymentStatus.CANCELED;
            await this.paymentRepository.save(payment);
        }
        return payment;
    }
    async getPaymentHistory(user, page = 1, limit = 10) {
        const [payments, total] = await this.paymentRepository.findAndCount({
            where: { userId: user.id },
            relations: ['order'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            items: payments,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async processPayment(orderId, channel, amount) {
        this.logger.log(`Processing payment for order ${orderId} via ${channel} for amount ${amount}`);
        try {
            const order = await this.orderRepository.findOne({ where: { id: orderId } });
            if (!order) {
                throw new common_1.NotFoundException(`Order with ID ${orderId} not found`);
            }
            const userId = order.userId;
            const payment = this.paymentRepository.create({
                orderId,
                userId,
                amount,
                channel,
                status: payment_entity_1.PaymentStatus.PROCESSING,
                paymentNo: this.generatePaymentNo(),
            });
            const savedPayment = await this.paymentRepository.save(payment);
            let result;
            switch (channel) {
                case payment_entity_1.PaymentChannel.ALIPAY:
                    result = await this.processAlipayPayment(savedPayment);
                    break;
                case payment_entity_1.PaymentChannel.WECHAT:
                    result = await this.processWechatPayment(savedPayment);
                    break;
                default:
                    throw new Error(`Unsupported payment channel: ${channel}`);
            }
            await this.update(savedPayment.id, {
                status: result.success ? payment_entity_1.PaymentStatus.SUCCESS : payment_entity_1.PaymentStatus.FAILED,
                transactionId: result.transactionId,
                paymentData: JSON.stringify(result.data),
            });
            if (result.success) {
                await this.orderService.updateOrderAfterPayment(orderId, savedPayment.id);
            }
            return result;
        }
        catch (error) {
            this.logger.error(`Payment processing error for order ${orderId}`, error.stack);
            throw error;
        }
    }
    async processAlipayPayment(payment) {
        return {
            success: true,
            transactionId: `ALI${Date.now()}`,
            message: 'Payment processed successfully',
            data: { paymentId: payment.id },
        };
    }
    async processWechatPayment(payment) {
        return {
            success: true,
            transactionId: `WX${Date.now()}`,
            message: 'Payment processed successfully',
            data: { paymentId: payment.id },
        };
    }
    async update(id, updateData) {
        const payment = await this.paymentRepository.findOne({
            where: { id: Number(id) }
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        Object.assign(payment, updateData);
        const updatedPayment = await this.paymentRepository.save(payment);
        this.logger.log(`Updated payment ${id} status to ${updateData.status}`);
        return updatedPayment;
    }
    async createPaymentForOrder(order, method) {
        const payment = this.paymentRepository.create({
            orderId: order.id,
            userId: order.userId,
            amount: order.actualAmount,
            method,
            status: payment_entity_1.PaymentStatus.PENDING,
            paymentNo: this.generatePaymentNo()
        });
        return this.paymentRepository.save(payment);
    }
};
exports.PaymentService = PaymentService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PaymentService.prototype, "handleTimeoutPayments", null);
exports.PaymentService = PaymentService = PaymentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        alipay_service_1.AlipayService,
        wechat_pay_service_1.WechatPayService,
        config_1.ConfigService, typeof (_a = typeof ioredis_1.RedisService !== "undefined" && ioredis_1.RedisService) === "function" ? _a : Object, order_service_1.OrderService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map