import { AetheronSDK } from "../src/index";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import type { Wallet } from "@solana/wallet-adapter-base";

const kp = Keypair.generate();
const mockWallet: Wallet = {
  publicKey: kp.publicKey,
  signTransaction: async (tx) => {
    tx.partialSign(kp);
    return tx;
  },
  signAllTransactions: async (txs) => {
    return txs.map((tx) => {
      tx.partialSign(kp);
      return tx;
    });
  },
  connected: true
};

const connection = new Connection(clusterApiUrl("mainnet-beta"));

async function demo() {
  const sdk = new AetheronSDK(mockWallet, connection);

  const result = await sdk.createComponent(
    "Generate a Solana meme with Grok",
    { amount: 0.5 }
  );

  console.log("Result →", result);
}

demo();
