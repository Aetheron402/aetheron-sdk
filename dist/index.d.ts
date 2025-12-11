import { Connection, Transaction } from "@solana/web3.js";
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base";
export interface AetheronConfig {
    endpoint?: string;
}
export declare class AetheronSDK {
    private api;
    private connection;
    private wallet;
    private readonly USDC_MINT;
    constructor(wallet: SignerWalletAdapter, connection: Connection, config?: AetheronConfig);
    requestPayment(amount: number): Promise<any>;
    signAndSend(tx: Transaction): Promise<string>;
    pay(amount: number): Promise<string>;
    generateComponent(prompt: string, opts?: {
        amount?: number;
    }): Promise<any>;
}
