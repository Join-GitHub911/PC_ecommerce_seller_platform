import { Module } from "vuex";
import { RootState } from "../types";
interface PaymentState {
    paymentMethods: PaymentMethod[];
    currentPayment: Payment | null;
    loading: boolean;
    error: string | null;
}
interface PaymentMethod {
    id: string;
    name: string;
    icon: string;
    description: string;
    isAvailable: boolean;
}
interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: "pending" | "success" | "failed";
    paymentTime?: string;
    errorMessage?: string;
}
declare const paymentModule: Module<PaymentState, RootState>;
export default paymentModule;
