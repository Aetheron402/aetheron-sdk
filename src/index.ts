import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as spl from "@solana/spl-token";
import type { Wallet } from "@solana/wallet-adapter-base";

export class AetheronSDK {
  private api = "https://api.aetheron402.com/v1";
  private solanaNetwork = "https://api.mainnet-beta.solana.com";
  private usdcMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
  private paymentWallet = "FZtoQTD7MLHvJzxxSPcUaQkXB5yP6qKYBZ8tUV18hHo1";

  constructor(
    private wallet: Wallet,
    private connection: Connection,
    endpoint?: string
  ) {
    if (endpoint) this.api = endpoint;
  }

  async pay(amount: number): Promise<string> {
    const payer = new PublicKey(this.wallet.publicKey.toString());
    const receiver = new PublicKey(this.paymentWallet);
    const mint = new PublicKey(this.usdcMint);

    const fromTokenAccount = (await spl.getOrCreateAssociatedTokenAccount(
      this.connection,
      payer,
      mint,
      payer
    )).address;

    const toTokenAccount = (await spl.getOrCreateAssociatedTokenAccount(
      this.connection,
      payer,
      mint,
      receiver
    )).address;

    const ix = spl.createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      payer,
      Math.floor(amount * 1_000_000)
    );

    const tx = new Transaction().add(ix);
    tx.feePayer = payer;
    const { blockhash } = await this.connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;

    const signed = await this.wallet.signTransaction(tx);
    const signature = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(signature, "finalized");

    return signature;
  }

  async createComponent(prompt: string, options: any = {}) {
    const signature = await this.pay(options.amount || 0.5);
    const res = await fetch(`${this.api}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, paymentSignature: signature, ...options })
    });
    if (!res.ok) throw new Error("Failed to create component");
    return res.json();
  }
}
