import { Module } from "vuex";
import { RootState } from "../types";
interface Address {
    id: number;
    name: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    tag: string;
    isDefault: boolean;
}
interface AddressState {
    addresses: Address[];
    loading: boolean;
    error: string | null;
}
declare const addressModule: Module<AddressState, RootState>;
export default addressModule;
