import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import type { Wallet } from "@solana/wallet-adapter-base";

export interface AetheronConfig {
  endpoint?: string;
}

export interface CreateComponentResult {
  download_url: string;
  asset_id: string;
  format: "pdf" | "txt" | "docx" | "html" | "md";
  prompt?: string;
  engine_version?: string;
}

export class AetheronSDK {
  private api: string;
  private connection: Connection;
  private wallet: Wallet;

  private readonly USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  private readonly PAYMENT_WALLET = "FZtoQTD7MLHvJzxxSPcUaQkXB5yP6qKYBZ8tUV18hHo1";

  constructor(
    wallet: Wallet,
    connection: Connection,
    config: AetheronConfig = {}
  ) {
    if (!wallet || !wallet.publicKey) throw new Error("Wallet not connected");
    this.wallet = wallet;
    this.connection = connection;
    this.api = config.endpoint ?? "https://api.aetheron402.com/v1";
  }

  async pay(amount: number = 0.5): Promise<string> {
    const payer = this.wallet.publicKey!;
    const mint = new PublicKey(this.USDC_MINT);
    const receiver = new PublicKey(this.PAYMENT_WALLET);

    const fromATA = (await spl.getOrCreateAssociatedTokenAccount(
      this.connection,
      payer,
      mint,
      payer
    )).address;

    const toATA = (await spl.getOrCreateAssociatedTokenAccount(
      this.connection,
      payer,
      mint,
      receiver
    )).address;

    const ix = spl.createTransferInstruction(
      fromATA,
      toATA,
      payer,
      Math.floor(amount * 1_000_000) // 6 decimals
    );

    const tx = new Transaction().add(ix);
    tx.feePayer = payer;
    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    const signed = await this.wallet.signTransaction(tx);
    const sig = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(sig, "confirmed");

    return sig;
  }

  async createComponent(
    prompt: string,
    options: { amount?: number } = {}
  ): Promise<CreateComponentResult> {
    const amount = options.amount ?? 0.5;
    const paymentSignature = await this.pay(amount);

    const res = await fetch(`${this.api}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        paymentSignature,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Aetheron API error ${res.status}: ${text}`);
    }

    return res.json();
  }
}
