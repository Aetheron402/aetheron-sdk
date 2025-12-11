# Aetheron SDK

Official SDK for the premium AI component marketplace on X402.  
Pay with **$AETH / USDC** on-chain, generate modular AI components instantly.

**Live platform • Solana-native • Fully non-custodial • Always expanding**

## Install
```bash
npm install aetheron-sdk   # publishing within 24 h
# or clone & use now
```

## Quickstart (Phantom + wallet-adapter)
```ts
import { AetheronSDK } from "aetheron-sdk";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react"; // or any adapter

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const wallet = useWallet(); // <-- this is the wallet object

const sdk = new AetheronSDK(wallet, connection);

try {
  const result = await sdk.createComponent("Generate a cyberpunk Solana cat", {
    amount: 0.5   // USDC, optional (default 0.5)
  });
  console.log("Downloaded at:", result.download_url);
} catch (err) {
  console.error("Aetheron error:", err);
}
```

## Or with raw Phantom (no React needed)
```ts
const connection = new Connection("https://api.mainnet-beta.solana.com");
const wallet = window.solana; // Phantom provider

const sdk = new AetheronSDK(wallet, connection);
await sdk.createComponent("Make a meme about pump.fun");
```

## Features
- Automatic on-chain USDC payment inside `createComponent()`
- Full TypeScript types
- Works with Phantom, Backpack, Solflare, wallet-adapter, etc.
- Custom RPC / API endpoint support

## Methods

| Method | Description |
|--------|-------------|
| `new AetheronSDK(wallet, connection, config?)` | Constructor |
| `pay(amount)` | Manual payment (rarely needed) |
| `createComponent(prompt, {amount?})` | Pays + generates — one line magic |

Website → https://aetheron402.com  
Twitter → @Aetheron402  

Built for automation. Designed for scale. Powered by X402.
