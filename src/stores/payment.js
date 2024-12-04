import { defineStore } from "pinia";

export const usePaymentStore = defineStore("payment", {
    state: () => ({
        paymentData: JSON.parse(localStorage.getItem("paymentData")) || null,
    }),
    actions: {
        setPaymentData(data) {
            this.paymentData = data;
            localStorage.setItem("paymentData", JSON.stringify(data));
        },
        clearPaymentData() {
            this.paymentData = null;
            localStorage.removeItem("paymentData");
        }
    }
});