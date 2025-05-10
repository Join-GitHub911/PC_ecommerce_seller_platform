"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_vue_1 = require("@vitejs/plugin-vue");
const path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_vue_1.default)()],
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src')
        }
    }
});
//# sourceMappingURL=vite.config.js.map