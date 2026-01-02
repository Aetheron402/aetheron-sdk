import { Connection } from "@solana/web3.js";
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base";
export interface AetheronConfig {
    endpoint?: string;
}
export type PaymentRequiredError = {
    status: 402;
    message?: string;
    paid?: number;
    remaining?: number;
    required?: number;
    currency?: "USDC" | "AETH";
    component?: string;
};
export declare class AetheronSDK {
    private api;
    private wallet;
    private connection;
    constructor(wallet: SignerWalletAdapter, connection: Connection, config?: AetheronConfig);
    private post;
    isPaymentRequired(error: unknown): error is PaymentRequiredError;
    getPaymentInfo(error: unknown): PaymentRequiredError | null;
    callPaidComponent<T>(opts: {
        endpoint: string;
        payload: any;
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<T>;
    promptOptimizer(payload: {
        text: string;
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<unknown>;
    codeExplainer(payload: {
        text: string;
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<unknown>;
    promptTester(payload: {
        text: string;
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<unknown>;
    contractIntel(payload: {
        contract_address: string;
        network: "solana" | "ethereum";
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<unknown>;
    downloadAgent(agentId: string, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<Blob>;
}
