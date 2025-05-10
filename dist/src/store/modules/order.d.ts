import { Module } from "vuex";
import { RootState } from "../types";
interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
    specifications: Record<string, string>;
}
interface Order {
    id: number;
    items: OrderItem[];
    totalAmount: number;
    deliveryFee: number;
    discount: number;
    finalAmount: number;
    status: string;
    addressId: number;
    paymentMethod: string;
    createTime: string;
}
interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
}
declare const orderModule: Module<OrderState, RootState>;
export default orderModule;
