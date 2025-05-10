"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orderModule = {
    namespaced: true,
    state: {
        orders: [],
        currentOrder: null,
        loading: false,
        error: null,
    },
    mutations: {
        SET_ORDERS(state, orders) {
            state.orders = orders;
        },
        SET_CURRENT_ORDER(state, order) {
            state.currentOrder = order;
        },
        ADD_ORDER(state, order) {
            state.orders.unshift(order);
        },
        UPDATE_ORDER_STATUS(state, { orderId, status }) {
            const order = state.orders.find((o) => o.id === orderId);
            if (order) {
                order.status = status;
            }
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
    },
    actions: {
        async createOrder({ commit }, orderData) {
            commit("SET_LOADING", true);
            try {
                const response = await fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(orderData),
                });
                const data = await response.json();
                commit("ADD_ORDER", data);
                commit("SET_CURRENT_ORDER", data);
                commit("SET_ERROR", null);
                return data;
            }
            catch (error) {
                commit("SET_ERROR", "创建订单失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async getOrders({ commit }) {
            commit("SET_LOADING", true);
            try {
                const response = await fetch("/api/orders");
                const data = await response.json();
                commit("SET_ORDERS", data);
                commit("SET_ERROR", null);
            }
            catch (error) {
                commit("SET_ERROR", "获取订单列表失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async getOrderDetail({ commit }, orderId) {
            commit("SET_LOADING", true);
            try {
                const response = await fetch(`/api/orders/${orderId}`);
                const data = await response.json();
                commit("SET_CURRENT_ORDER", data);
                commit("SET_ERROR", null);
                return data;
            }
            catch (error) {
                commit("SET_ERROR", "获取订单详情失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async updateOrderStatus({ commit }, { orderId, status }) {
            commit("SET_LOADING", true);
            try {
                await fetch(`/api/orders/${orderId}/status`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status }),
                });
                commit("UPDATE_ORDER_STATUS", { orderId, status });
                commit("SET_ERROR", null);
            }
            catch (error) {
                commit("SET_ERROR", "更新订单状态失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
    },
    getters: {
        orderById: (state) => (id) => {
            return state.orders.find((order) => order.id === id);
        },
        ordersByStatus: (state) => (status) => {
            return state.orders.filter((order) => order.status === status);
        },
    },
};
exports.default = orderModule;
//# sourceMappingURL=order.js.map