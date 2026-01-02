"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AetheronSDK = void 0;
class AetheronSDK {
    constructor(wallet, connection, config = {}) {
        if (!wallet || !wallet.publicKey) {
            const err = new Error("Wallet not connected. Aetheron SDK is designed to be used inside a browser app with a connected Solana wallet.");
            err.code = "WALLET_REQUIRED";
            throw err;
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
            let detail;
            try {
                detail = await res.json();
            }
            catch {
                detail = await res.text();
            }
            const err = new Error(typeof detail === "string"
                ? detail
                : detail?.message || `Request failed (${res.status})`);
            err.status = res.status;
            err.detail = detail;
            throw err;
        }
        return res.json();
    }
    isPaymentRequired(error) {
        return (typeof error === "object" &&
            error !== null &&
            error.status === 402);
    }
    getPaymentInfo(error) {
        if (!this.isPaymentRequired(error))
            return null;
        return error;
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
