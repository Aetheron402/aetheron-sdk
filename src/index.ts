import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base";

export interface AetheronConfig {
  endpoint?: string;
}

export class AetheronSDK {
  private api: string;
  private connection: Connection;
  private wallet: SignerWalletAdapter;

  private readonly USDC_MINT = new PublicKey(
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
  );

  constructor(
    wallet: SignerWalletAdapter,
    connection: Connection,
    config: AetheronConfig = {}
  ) {
    if (!wallet || !wallet.publicKey)
      throw new Error("Wallet not connected");

    this.wallet = wallet;
    this.connection = connection;
    this.api = config.endpoint ?? "https://api.aetheron402.com/v1";
  }

  // Request a payment instruction from backend
  async requestPayment(amount: number) {
    const res = await fetch(`${this.api}/payment/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount })
    });

    if (!res.ok) throw new Error(`Payment request failed: ${res.status}`);
    return res.json();
  }

  async signAndSend(tx: Transaction): Promise<string> {
      tx.feePayer = this.wallet.publicKey!;
      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

      const signed = await this.wallet.signTransaction(tx);

      const sig = await this.connection.sendRawTransaction(signed.serialize());
      await this.connection.confirmTransaction(sig, "confirmed");
      return sig;
  }

  async pay(amount: number): Promise<string> {
    const { transaction_base64 } = await this.requestPayment(amount);
    const tx = Transaction.from(Buffer.from(transaction_base64, "base64"));

    return await this.signAndSend(tx);
  }

  async generateComponent(
    prompt: string,
    opts: { amount?: number } = {}
  ) {
    const amount = opts.amount ?? 0.5;
    const paymentSignature = await this.pay(amount);

    const res = await fetch(`${this.api}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, paymentSignature })
    });

    if (!res.ok) throw new Error(`Generation failed: ${res.status}`);
    return res.json();
  }
}
