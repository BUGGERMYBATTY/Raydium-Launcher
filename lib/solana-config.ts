// lib/solana-config.ts
// Safe Solana + IPFS config file (no API keys in frontend)

export const SOLANA_CONFIG = {
  // Solana network settings
  network: import.meta.env.VITE_SOLANA_NETWORK || "devnet",
  rpcUrl: import.meta.env.VITE_SOLANA_RPC_URL || "https://api.devnet.solana.com",

  // Gateway for public access (safe to expose)
  gateway: import.meta.env.VITE_PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs/",

  // Backend proxy (handles uploads securely)
  apiBase: import.meta.env.VITE_API_BASE || "http://localhost:3001",
};

