# Aetheron SDK

Official SDK for interacting with the **Aetheron AI Component Platform (X402 Engine)**.  
Provides streamlined on-chain payments (**USDC / $AETH**) and component generation.

Fully **non‑custodial**, **Solana‑native**, and **production‑ready**.

---

## Installation

```bash
npm install aetheron-sdk   # coming soon
```

Or clone:

```bash
git clone https://github.com/Aetheron402/aetheron-sdk
```

---

## Quickstart (React + wallet-adapter)

```ts
import { AetheronSDK } from "aetheron-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const wallet = useWallet();                     // must be a SignerWalletAdapter
const connection = new Connection(clusterApiUrl("mainnet-beta"));

const sdk = new AetheronSDK(wallet, connection);

const result = await sdk.generateComponent(
  "Generate a Solana-themed AI mascot",
  { amount: 0.5 }  // USD-equivalent price
);

console.log(result.download_url);
```

---

## Usage: Phantom Provider Only

```ts
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = window.solana; // Phantom provider

const sdk = new AetheronSDK(wallet, connection);

await sdk.generateComponent("Make a pump.fun meme");
```

---

## How the SDK Works

1. SDK requests payment instructions (`/payment/request`)  
2. Backend returns a **prebuilt transaction**  
3. Wallet signs  
4. SDK broadcasts & confirms  
5. Backend generates the component  
6. A **download URL** is returned  

No private keys ever leave the user wallet.  
No custody. No backend-held balances.

---

## Features

- One‑line **payment + generation** workflow  
- Phantom, Backpack, Solflare, wallet-adapter compatible  
- Works with **$AETH** or **USDC**  
- TypeScript-native  
- Optional custom RPC  
- Safe, minimal interface  

---

## API Reference

### **Constructor**
```ts
new AetheronSDK(wallet, connection, config?)
```

---  

### **generateComponent()**
```ts
await sdk.generateComponent(prompt, {
  amount?: number,
  format?: "pdf" | "txt" | "docx" | "md" | "html"
});
```

---

### **pay()**
```ts
await sdk.pay(amount);
```

---

## Response Example

```ts
{
  download_url: string,
  asset_id: string,
  format: "pdf" | "txt" | "docx" | "md" | "html"
}
```

---

## Links

Website → https://aetheron402.com  
Twitter → https://x.com/Aetheron402  
Email → team@aetheron402.com  

---

**Automation-ready. Built on X402.**
