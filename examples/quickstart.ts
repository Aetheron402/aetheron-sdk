import { AetheronSDK } from "../src/index";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import type { SignerWalletAdapter } from "@solana/wallet-adapter-base";

// Mock wallet ONLY provides a publicKey now
const kp = Keypair.generate();

const mockWallet = {
  publicKey: kp.publicKey
} as SignerWalletAdapter;

const connection = new Connection(clusterApiUrl("mainnet-beta"));

async function demo() {
  const sdk = new AetheronSDK(mockWallet, connection);

  try {
    // First attempt — expected to throw 402
    const res = await sdk.promptOptimizer(
      { text: "Generate a Solana meme with Grok", format: "pdf" },
      { paymentMethod: "USDC" }
    );

    console.log("Queued:", res);

  } catch (e: any) {
    if (e.status === 402) {
      console.log("Payment required");
      console.log("Send:", e.remaining ?? e.required, e.currency);

      // In a real app, user sends payment manually.
      // For demo purposes, we just show where txSig goes.
      const fakeTxSig = "PASTE_REAL_TX_SIGNATURE_HERE";

      const retry = await sdk.promptOptimizer(
        { text: "Generate a Solana meme with Grok", format: "pdf" },
        { paymentMethod: "USDC", txSig: fakeTxSig }
      );

      console.log("Queued after payment:", retry);
    } else {
      throw e;
    }
  }
}

demo();
