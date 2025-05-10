"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const typeorm_1 = require("@nestjs/typeorm");
const order_service_1 = require("../order.service");
const order_state_manager_service_1 = require("../order-state-manager.service");
const Order_1 = require("@/entities/Order");
const order_1 = require("../../../types/order");
describe("OrderService", () => {
    let service;
    let orderRepository;
    let orderStateManager;
    const mockOrder = {
        id: "test-order-id",
        userId: "test-user-id",
        status: order_1.OrderStatus.PENDING_PAYMENT,
        items: [],
        totalAmount: 100,
        finalAmount: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                order_service_1.OrderService,
                {
                    provide: (0, typeorm_1.getRepositoryToken)(Order_1.Order),
                    useValue: {
                        create: jest.fn().mockReturnValue(mockOrder),
                        save: jest.fn().mockResolvedValue(mockOrder),
                        findOne: jest.fn().mockResolvedValue(mockOrder),
                        find: jest.fn().mockResolvedValue([mockOrder]),
                    },
                },
                {
                    provide: order_state_manager_service_1.OrderStateManager,
                    useValue: {
                        handlePaymentSuccess: jest.fn(),
                        handleShipment: jest.fn(),
                        handleReceipt: jest.fn(),
                        handleCancel: jest.fn(),
                    },
                },
            ],
        }).compile();
        service = module.get(order_service_1.OrderService);
        orderRepository = module.get((0, typeorm_1.getRepositoryToken)(Order_1.Order));
        orderStateManager = module.get(order_state_manager_service_1.OrderStateManager);
    });
    it("should be defined", () => {
        expect(service).toBeDefined();
    });
    describe("createOrder", () => {
        const createOrderDto = {
            userId: "test-user-id",
            items: [
                {
                    productId: "test-product-id",
                    quantity: 1,
                    specifications: { color: "red", size: "M" },
                },
            ],
            addressId: "test-address-id",
        };
        it("should create order successfully", async () => {
            const result = await service.createOrder(createOrderDto);
            expect(result).toEqual(mockOrder);
            expect(orderRepository.create).toHaveBeenCalled();
            expect(orderRepository.save).toHaveBeenCalled();
        });
        it("should throw error when items are empty", async () => {
            await expect(service.createOrder(Object.assign(Object.assign({}, createOrderDto), { items: [] }))).rejects.toThrow("订单商品不能为空");
        });
    });
    describe("getOrderDetail", () => {
        it("should return order detail", async () => {
            const result = await service.getOrderDetail("test-order-id", "test-user-id");
            expect(result).toEqual(mockOrder);
            expect(orderRepository.findOne).toHaveBeenCalled();
        });
        it("should throw error when order not found", async () => {
            orderRepository.findOne.mockResolvedValueOnce(null);
            await expect(service.getOrderDetail("non-exist-id", "test-user-id")).rejects.toThrow("订单不存在");
        });
    });
});
describe("OrderStateManager", () => {
});
//# sourceMappingURL=order.service.spec.js.map