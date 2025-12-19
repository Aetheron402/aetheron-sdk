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

export class AetheronSDK {
  private api: string;
  private wallet: SignerWalletAdapter;
  private connection: Connection;

  constructor(
    wallet: SignerWalletAdapter,
    connection: Connection,
    config: AetheronConfig = {}
  ) {
    if (!wallet || !wallet.publicKey) {
      throw new Error("Wallet not connected");
    }

    this.wallet = wallet;
    this.connection = connection;
    this.api = config.endpoint ?? "https://api.aetheron402.com";
  }

  private async post(
    endpoint: string,
    payload: any,
    paymentMethod: "USDC" | "AETH" = "USDC",
    txSig?: string
  ): Promise<any> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-USER-WALLET": this.wallet.publicKey!.toBase58(),
      "X-PAYMENT-METHOD": paymentMethod
    };

    if (txSig) {
      headers["X-TX-SIG"] = txSig;
    }

    const res = await fetch(`${this.api}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });

    if (res.status === 402) {
      throw (await res.json()) as PaymentRequiredError;
    }

    if (res.status === 409) {
      throw new Error("Transaction signature already used");
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Request failed (${res.status}): ${text}`);
    }

    return res.json();
  }

  async callPaidComponent(opts: {
    endpoint: string;
    payload: any;
    paymentMethod?: "USDC" | "AETH";
    txSig?: string;
  }) {
    return this.post(
      opts.endpoint,
      opts.payload,
      opts.paymentMethod ?? "USDC",
      opts.txSig
    );
  }

  promptOptimizer(
    payload: { text: string; format?: string },
    opts?: { paymentMethod?: "USDC" | "AETH"; txSig?: string }
  ) {
    return this.callPaidComponent({
      endpoint: "/api/prompt-optimizer",
      payload,
      ...opts
    });
  }

  codeExplainer(
    payload: { text: string; format?: string },
    opts?: { paymentMethod?: "USDC" | "AETH"; txSig?: string }
  ) {
    return this.callPaidComponent({
      endpoint: "/api/code-explainer",
      payload,
      ...opts
    });
  }

  promptTester(
    payload: { text: string; format?: string },
    opts?: { paymentMethod?: "USDC" | "AETH"; txSig?: string }
  ) {
    return this.callPaidComponent({
      endpoint: "/api/prompt-tester",
      payload,
      ...opts
    });
  }

  contractIntel(
    payload: {
      contract_address: string;
      network: "solana" | "ethereum";
      format?: string;
    },
    opts?: { paymentMethod?: "USDC" | "AETH"; txSig?: string }
  ) {
    return this.callPaidComponent({
      endpoint: "/api/contract-intel",
      payload,
      ...opts
    });
  }
}
