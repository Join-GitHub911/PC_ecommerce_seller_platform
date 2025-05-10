"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vue_router_1 = require("vue-router");
const HomeView_vue_1 = require("../views/HomeView.vue");
const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView_vue_1.default,
    },
    {
        path: "/about",
        name: "about",
        component: () => Promise.resolve().then(() => require("../views/AboutView.vue")),
    },
];
const router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(process.env.BASE_URL),
    routes,
});
exports.default = router;
//# sourceMappingURL=index.js.map