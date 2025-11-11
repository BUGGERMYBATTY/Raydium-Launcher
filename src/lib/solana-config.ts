import { clusterApiUrl, Connection } from "@solana/web3.js";

export const SOLANA_CONFIG = {
  apiBase: import.meta.env.VITE_API_BASE || "http://localhost:3001",
  gateway: import.meta.env.VITE_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/",
};

const network = (import.meta.env.VITE_SOLANA_NETWORK as string) || "devnet";
const rpcUrl =
  (import.meta.env.VITE_SOLANA_RPC_URL as string) || clusterApiUrl(network);

export const connection = new Connection(rpcUrl, "confirmed");

export const TOKEN_DEFAULTS = {
  decimals: Number(import.meta.env.VITE_TOKEN_DECIMALS ?? 9),
  symbol: (import.meta.env.VITE_TOKEN_SYMBOL as string) || "TOKEN",
  name: (import.meta.env.VITE_TOKEN_NAME as string) || "My Token",
};

/** Keep this here because TokenResult.tsx imports it */
export function getExplorerUrl(signature: string, net: string = network) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${net}`;
}
