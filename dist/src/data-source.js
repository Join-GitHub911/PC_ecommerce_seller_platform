"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, '../../.env.development') });
const databaseConfig = {
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 3306,
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || 'root',
    database: process.env.DATABASE_NAME || 'ecommerce_dev',
};
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: databaseConfig.host,
    port: databaseConfig.port,
    username: databaseConfig.username,
    password: databaseConfig.password,
    database: databaseConfig.database,
    entities: [
        path.join(__dirname, '**/*.entity{.ts,.js}'),
        path.join(__dirname, 'modules/**/*.entity{.ts,.js}')
    ],
    migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
    synchronize: false,
    logging: true,
    extra: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci',
    },
});
//# sourceMappingURL=data-source.js.map