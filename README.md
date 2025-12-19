# Aetheron SDK

Official SDK for interacting with the **Aetheron AI Component Platform (X402 Engine)**.

Provides a **manual on-chain payment flow** for AI components and agent downloads using  
**USDC or $AETH on Solana**.

Fully **non-custodial**, **Solana-native**, and **production-ready**.

---

## Installation

```bash
npm install aetheron-sdk
```

Or clone:

```bash
git clone https://github.com/Aetheron402/aetheron-sdk
```

---

## Requirements

- Node **18+** (or any environment with `fetch`)
- A Solana wallet (Phantom, Backpack, Solflare, wallet-adapter)
- Manual transaction signing by the user

---

## Quickstart (React + wallet-adapter)

```ts
import { AetheronSDK } from "aetheron-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const wallet = useWallet(); // SignerWalletAdapter
const connection = new Connection(clusterApiUrl("mainnet-beta"));

const sdk = new AetheronSDK(wallet, connection);

try {
  // First call will intentionally throw 402
  await sdk.promptOptimizer(
    { text: "Generate a Solana-themed AI mascot", format: "pdf" },
    { paymentMethod: "USDC" }
  );

} catch (e: any) {
  if (e.status === 402) {
    // User sends payment manually (wallet UI)
    // Then retries with the transaction signature
    const txSig = prompt("Paste your Solana transaction signature:");

    const result = await sdk.promptOptimizer(
      { text: "Generate a Solana-themed AI mascot", format: "pdf" },
      { paymentMethod: "USDC", txSig }
    );

    console.log(result);
  }
}
```

---

## How the SDK Works (X402 Flow)

1. SDK calls a paid endpoint  
2. Backend responds with **HTTP 402 Payment Required**  
3. User sends **USDC or AETH** on-chain  
4. User provides the **transaction signature**  
5. SDK retries with `X-TX-SIG`  
6. Backend verifies payment and queues the job  
7. Result is returned (or a download URL when ready)

**No transaction building. No signing. No custody.**  
The wallet stays fully in control.

---

## Supported Components

### Prompt Optimizer
```ts
sdk.promptOptimizer(
  { text: string, format?: "pdf" | "txt" | "docx" | "md" | "html" },
  { paymentMethod?: "USDC" | "AETH", txSig?: string }
);
```

---

### Code Explainer
```ts
sdk.codeExplainer(
  { text: string, format?: string },
  { paymentMethod?: "USDC" | "AETH", txSig?: string }
);
```

---

### Prompt Tester (PersonaSim)
```ts
sdk.promptTester(
  { text: string, format?: string },
  { paymentMethod?: "USDC" | "AETH", txSig?: string }
);
```

---

### Contract Intelligence Analyzer
```ts
sdk.contractIntel(
  {
    contract_address: string,
    network: "solana" | "ethereum",
    format?: string
  },
  { paymentMethod?: "USDC" | "AETH", txSig?: string }
);
```

---

### Download Prebuilt Agents
```ts
const zip = await sdk.downloadAgent("solana-sniper", {
  paymentMethod: "USDC",
  txSig
});

// save zip yourself
```

Returns a **Blob**.  
The SDK does not save files automatically.

---

## Error Handling

### Payment Required (402)

```ts
type PaymentRequiredError = {
  status: 402;
  paid?: number;
  remaining?: number;
  required?: number;
  currency?: "USDC" | "AETH";
  component?: string;
};
```

You are expected to:
- show payment instructions
- accept a transaction signature
- retry the request

---

## Design Principles

- Manual on-chain payments (X402)
- No backend-held balances
- No private key access
- No transaction signing in SDK
- Frontend / CLI / server compatible
- Browser & Node 18+ ready

---

## Links

Website → https://aetheron402.com  
Twitter → https://x.com/Aetheron402  
Email → team@aetheron402.com  

---

**Built for composable AI. Powered by X402.**
