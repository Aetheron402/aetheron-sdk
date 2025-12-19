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
    callPaidComponent(opts: {
        endpoint: string;
        payload: any;
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<any>;
    promptOptimizer(payload: {
        text: string;
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<any>;
    codeExplainer(payload: {
        text: string;
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<any>;
    promptTester(payload: {
        text: string;
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<any>;
    contractIntel(payload: {
        contract_address: string;
        network: "solana" | "ethereum";
        format?: string;
    }, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<any>;
    downloadAgent(agentId: string, opts?: {
        paymentMethod?: "USDC" | "AETH";
        txSig?: string;
    }): Promise<Blob>;
}
