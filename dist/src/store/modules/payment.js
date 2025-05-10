"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentModule = {
    namespaced: true,
    state: {
        paymentMethods: [
            {
                id: "alipay",
                name: "支付宝",
                icon: "/images/payment/alipay.png",
                description: "支持支付宝账户余额和花呗支付",
                isAvailable: true,
            },
            {
                id: "wechat",
                name: "微信支付",
                icon: "/images/payment/wechat.png",
                description: "支持微信账户余额支付",
                isAvailable: true,
            },
            {
                id: "unionpay",
                name: "银联支付",
                icon: "/images/payment/unionpay.png",
                description: "支持储蓄卡和信用卡支付",
                isAvailable: true,
            },
        ],
        currentPayment: null,
        loading: false,
        error: null,
    },
    mutations: {
        SET_PAYMENT_METHODS(state, methods) {
            state.paymentMethods = methods;
        },
        SET_CURRENT_PAYMENT(state, payment) {
            state.currentPayment = payment;
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
    },
    actions: {
        async createPayment({ commit }, { orderId, method, amount }) {
            commit("SET_LOADING", true);
            try {
                const response = await fetch("/api/payments", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        orderId,
                        method,
                        amount,
                    }),
                });
                const data = await response.json();
                commit("SET_CURRENT_PAYMENT", data);
                return data;
            }
            catch (error) {
                commit("SET_ERROR", "创建支付订单失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async checkPaymentStatus({ commit }, paymentId) {
            try {
                const response = await fetch(`/api/payments/${paymentId}/status`);
                const data = await response.json();
                commit("SET_CURRENT_PAYMENT", data);
                return data.status;
            }
            catch (error) {
                commit("SET_ERROR", "查询支付状态失败");
                throw error;
            }
        },
        async cancelPayment({ commit }, paymentId) {
            commit("SET_LOADING", true);
            try {
                await fetch(`/api/payments/${paymentId}/cancel`, {
                    method: "POST",
                });
                commit("SET_CURRENT_PAYMENT", null);
            }
            catch (error) {
                commit("SET_ERROR", "取消支付失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
    },
    getters: {
        availablePaymentMethods: (state) => {
            return state.paymentMethods.filter((method) => method.isAvailable);
        },
    },
};
exports.default = paymentModule;
//# sourceMappingURL=payment.js.map