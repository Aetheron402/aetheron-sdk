# Aetheron SDK

Official SDK for interacting with the Aetheron AI Component Platform on X402.  
Handles on-chain payments (**$AETH / USDC**) and component generation through a clean, minimal API.

**Solana-native • Fully non-custodial • Production-ready**

## Install
```bash
npm install aetheron-sdk   # coming soon
```

Or clone directly:
```bash
git clone https://github.com/Aetheron402/aetheron-sdk
```

## Quickstart (wallet-adapter setup)
```ts
import { AetheronSDK } from "aetheron-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";

const wallet = useWallet();               // must be a SignerWalletAdapter
const connection = new Connection(clusterApiUrl("mainnet-beta"));

const sdk = new AetheronSDK(wallet, connection);

const result = await sdk.generateComponent(
  "Generate a Solana-themed AI mascot",
  { amount: 0.5 }
);

console.log("Download URL:", result.download_url);
```

## Using raw Phantom (no React)
```ts
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = window.solana; // Phantom injected provider

const sdk = new AetheronSDK(wallet, connection);

await sdk.generateComponent("Make a pump.fun meme");
```

## How It Works
1. **Request payment instructions** (`/payment/request`)
2. **User signs pre-built transaction**
3. **SDK sends & confirms the tx**
4. **Component is generated and returned**

## Features
- One-line payment + generation flow  
- Works with Phantom, Backpack, Solflare, wallet-adapter  
- Fully non-custodial  
- Includes TypeScript definitions  
- Supports custom RPC + API endpoints  
- USDC / $AETH compatible  

## API Reference

### Constructor
```ts
new AetheronSDK(wallet, connection, config?)
```

### generateComponent()
```ts
await sdk.generateComponent(prompt, { amount?: number });
```

### pay()
```ts
await sdk.pay(amount);
```

## Response Example
```ts
{
  download_url: string,
  asset_id: string,
  format: "pdf" | "txt" | "docx" | "md" | "html"
}
```

## Links
Website → https://aetheron402.com  
Twitter → https://x.com/Aetheron402  

Built for automation. Powered by X402.
