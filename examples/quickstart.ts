import { AetheronSDK } from "../src/index.ts";
import { Connection, clusterApiUrl } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));

async function demo() {
  const sdk = new AetheronSDK(wallet, connection);
  const result = await sdk.createComponent("Generate a Solana meme with Grok", { amount: 0.5 });
  console.log("Result →", result);
}
demo();
