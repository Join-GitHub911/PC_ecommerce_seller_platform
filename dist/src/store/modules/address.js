"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const addressModule = {
    namespaced: true,
    state: {
        addresses: [],
        loading: false,
        error: null,
    },
    mutations: {
        SET_ADDRESSES(state, addresses) {
            state.addresses = addresses;
        },
        ADD_ADDRESS(state, address) {
            state.addresses.push(address);
        },
        UPDATE_ADDRESS(state, updatedAddress) {
            const index = state.addresses.findIndex((addr) => addr.id === updatedAddress.id);
            if (index !== -1) {
                state.addresses.splice(index, 1, updatedAddress);
            }
        },
        DELETE_ADDRESS(state, addressId) {
            state.addresses = state.addresses.filter((addr) => addr.id !== addressId);
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
    },
    actions: {
        async getAddresses({ commit }) {
            commit("SET_LOADING", true);
            try {
                const response = await fetch("/api/addresses");
                const data = await response.json();
                commit("SET_ADDRESSES", data);
                commit("SET_ERROR", null);
            }
            catch (error) {
                commit("SET_ERROR", "获取地址列表失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async addAddress({ commit }, addressData) {
            commit("SET_LOADING", true);
            try {
                const response = await fetch("/api/addresses", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(addressData),
                });
                const data = await response.json();
                commit("ADD_ADDRESS", data);
                commit("SET_ERROR", null);
                return data;
            }
            catch (error) {
                commit("SET_ERROR", "添加地址失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async updateAddress({ commit }, _a) {
            var { id } = _a, addressData = __rest(_a, ["id"]);
            commit("SET_LOADING", true);
            try {
                const response = await fetch(`/api/addresses/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(addressData),
                });
                const data = await response.json();
                commit("UPDATE_ADDRESS", data);
                commit("SET_ERROR", null);
                return data;
            }
            catch (error) {
                commit("SET_ERROR", "更新地址失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
        async deleteAddress({ commit }, addressId) {
            commit("SET_LOADING", true);
            try {
                await fetch(`/api/addresses/${addressId}`, {
                    method: "DELETE",
                });
                commit("DELETE_ADDRESS", addressId);
                commit("SET_ERROR", null);
            }
            catch (error) {
                commit("SET_ERROR", "删除地址失败");
                throw error;
            }
            finally {
                commit("SET_LOADING", false);
            }
        },
    },
    getters: {
        defaultAddress: (state) => {
            return state.addresses.find((addr) => addr.isDefault);
        },
        addressById: (state) => (id) => {
            return state.addresses.find((addr) => addr.id === id);
        },
    },
};
exports.default = addressModule;
//# sourceMappingURL=address.js.map