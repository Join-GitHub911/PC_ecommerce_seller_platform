"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTables1700000000000 = void 0;
class CreateTables1700000000000 {
    constructor() {
        this.name = 'CreateTables1700000000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE \`users\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`username\` varchar(255) NOT NULL,
        \`password\` varchar(255) NOT NULL,
        \`email\` varchar(255) NOT NULL,
        \`phone\` varchar(20) NULL,
        \`role\` enum('admin','user') NOT NULL DEFAULT 'user',
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`avatar\` varchar(255) NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`),
        UNIQUE KEY \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`addresses\` (
        \`id\` varchar(36) NOT NULL,
        \`userId\` int NOT NULL,
        \`receiver\` varchar(255) NOT NULL,
        \`phone\` varchar(20) NOT NULL,
        \`province\` varchar(255) NOT NULL,
        \`city\` varchar(255) NOT NULL,
        \`district\` varchar(255) NOT NULL,
        \`detail\` varchar(255) NOT NULL,
        \`postalCode\` varchar(20) NULL,
        \`isDefault\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_7e77f562043393b08de949b804\` (\`userId\`),
        CONSTRAINT \`FK_7e77f562043393b08de949b804\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`categories\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`parentId\` varchar(36) NULL,
        \`level\` int NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        \`sort\` int NOT NULL DEFAULT 0,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`products\` (
        \`id\` varchar(36) NOT NULL,
        \`name\` varchar(255) NOT NULL,
        \`description\` text NOT NULL,
        \`categoryId\` varchar(36) NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`originalPrice\` decimal(10,2) NOT NULL,
        \`stock\` int NOT NULL,
        \`sales\` int NOT NULL DEFAULT 0,
        \`isOnSale\` tinyint NOT NULL DEFAULT 1,
        \`isDeleted\` tinyint NOT NULL DEFAULT 0,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_ff56834e735fa78a15d0cf2191\` (\`categoryId\`),
        CONSTRAINT \`FK_ff56834e735fa78a15d0cf2191\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categories\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`product_images\` (
        \`id\` varchar(36) NOT NULL,
        \`productId\` varchar(36) NOT NULL,
        \`url\` varchar(255) NOT NULL,
        \`sort\` int NOT NULL DEFAULT 0,
        \`isMain\` tinyint NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f8a\` (\`productId\`),
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f8a\` FOREIGN KEY (\`productId\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`product_skus\` (
        \`id\` varchar(36) NOT NULL,
        \`productId\` varchar(36) NOT NULL,
        \`skuCode\` varchar(255) NOT NULL,
        \`specifications\` json NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`stock\` int NOT NULL,
        \`isActive\` tinyint NOT NULL DEFAULT 1,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f8b\` (\`productId\`),
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f8b\` FOREIGN KEY (\`productId\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`orders\` (
        \`id\` varchar(36) NOT NULL,
        \`orderNo\` varchar(255) NOT NULL,
        \`userId\` int NOT NULL,
        \`totalAmount\` decimal(10,2) NOT NULL,
        \`actualAmount\` decimal(10,2) NOT NULL,
        \`status\` enum('pending','paid','shipped','delivered','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
        \`paymentMethod\` varchar(50) NULL,
        \`paymentTime\` datetime NULL,
        \`shippingTime\` datetime NULL,
        \`deliveryTime\` datetime NULL,
        \`completionTime\` datetime NULL,
        \`cancelTime\` datetime NULL,
        \`cancelReason\` varchar(255) NULL,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`IDX_781c7a72e56c6c4a6c564f2f2f\` (\`orderNo\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f8c\` (\`userId\`),
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f8c\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`order_items\` (
        \`id\` varchar(36) NOT NULL,
        \`orderId\` varchar(36) NOT NULL,
        \`productId\` varchar(36) NOT NULL,
        \`quantity\` int NOT NULL,
        \`price\` decimal(10,2) NOT NULL,
        \`totalPrice\` decimal(10,2) NOT NULL,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f8d\` (\`orderId\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f8e\` (\`productId\`),
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f8d\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f8e\` FOREIGN KEY (\`productId\`) REFERENCES \`products\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`order_addresses\` (
        \`id\` varchar(36) NOT NULL,
        \`orderId\` varchar(36) NOT NULL,
        \`receiver\` varchar(255) NOT NULL,
        \`phone\` varchar(20) NOT NULL,
        \`province\` varchar(255) NOT NULL,
        \`city\` varchar(255) NOT NULL,
        \`district\` varchar(255) NOT NULL,
        \`detail\` varchar(255) NOT NULL,
        \`postalCode\` varchar(20) NULL,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f8f\` (\`orderId\`),
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f8f\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        await queryRunner.query(`
      CREATE TABLE \`payments\` (
        \`id\` varchar(36) NOT NULL,
        \`orderId\` varchar(36) NOT NULL,
        \`userId\` int NOT NULL,
        \`amount\` decimal(10,2) NOT NULL,
        \`status\` enum('pending','success','failed','refunded') NOT NULL DEFAULT 'pending',
        \`method\` enum('alipay','wechat','unionpay') NOT NULL,
        \`transactionId\` varchar(255) NULL,
        \`paymentData\` json NULL,
        \`paidAt\` datetime NULL,
        \`refundedAt\` datetime NULL,
        \`refundedAmount\` decimal(10,2) NOT NULL DEFAULT 0,
        \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f90\` (\`orderId\`),
        KEY \`IDX_6c8b09f23574d6a71c6d2f9f91\` (\`userId\`),
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f90\` FOREIGN KEY (\`orderId\`) REFERENCES \`orders\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`FK_6c8b09f23574d6a71c6d2f9f91\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`payments\``);
        await queryRunner.query(`DROP TABLE \`order_addresses\``);
        await queryRunner.query(`DROP TABLE \`order_items\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`product_skus\``);
        await queryRunner.query(`DROP TABLE \`product_images\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`addresses\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.CreateTables1700000000000 = CreateTables1700000000000;
//# sourceMappingURL=1700000000000-CreateTables.js.map