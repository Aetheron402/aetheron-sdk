"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AetheronSDK = void 0;
class AetheronSDK {
    constructor(wallet, connection, config = {}) {
        if (!wallet || !wallet.publicKey) {
            throw new Error("Wallet not connected");
        }
        this.wallet = wallet;
        this.connection = connection;
        this.api = config.endpoint ?? "https://api.aetheron402.com";
    }
    async post(endpoint, payload, paymentMethod = "USDC", txSig) {
        const headers = {
            "Content-Type": "application/json",
            "X-USER-WALLET": this.wallet.publicKey.toBase58(),
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
            throw (await res.json());
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
    async callPaidComponent(opts) {
        return this.post(opts.endpoint, opts.payload, opts.paymentMethod ?? "USDC", opts.txSig);
    }
    promptOptimizer(payload, opts) {
        return this.callPaidComponent({
            endpoint: "/api/prompt-optimizer",
            payload,
            ...opts
        });
    }
    codeExplainer(payload, opts) {
        return this.callPaidComponent({
            endpoint: "/api/code-explainer",
            payload,
            ...opts
        });
    }
    promptTester(payload, opts) {
        return this.callPaidComponent({
            endpoint: "/api/prompt-tester",
            payload,
            ...opts
        });
    }
    contractIntel(payload, opts) {
        return this.callPaidComponent({
            endpoint: "/api/contract-intel",
            payload,
            ...opts
        });
    }
    async downloadAgent(agentId, opts) {
        const headers = {
            "X-USER-WALLET": this.wallet.publicKey.toBase58(),
            "X-PAYMENT-METHOD": opts?.paymentMethod ?? "USDC"
        };
        if (opts?.txSig) {
            headers["X-TX-SIG"] = opts.txSig;
        }
        const res = await fetch(`${this.api}/api/download_agent/${agentId}`, {
            method: "GET",
            headers
        });
        if (res.status === 402) {
            throw await res.json();
        }
        if (res.status === 409) {
            throw new Error("Transaction signature already used");
        }
        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Download failed (${res.status}): ${text}`);
        }
        return res.blob();
    }
}
exports.AetheronSDK = AetheronSDK;
