import { Repository, Connection } from "typeorm";
import { Product } from "@/entities/Product";
import { InventoryLock } from "@/entities/InventoryLock";
import { Order } from "@/entities/Order";
export declare class InventoryService {
    private productRepository;
    private inventoryLockRepository;
    private orderRepository;
    private connection;
    constructor(productRepository: Repository<Product>, inventoryLockRepository: Repository<InventoryLock>, orderRepository: Repository<Order>, connection: Connection);
    lockInventory(orderId: string): Promise<void>;
    releaseInventory(orderId: string): Promise<void>;
    deductInventory(orderId: string): Promise<void>;
    checkInventory(items: Array<{
        productId: string;
        quantity: number;
    }>): Promise<{
        isAvailable: boolean;
        insufficientItems: any[];
    }>;
}
