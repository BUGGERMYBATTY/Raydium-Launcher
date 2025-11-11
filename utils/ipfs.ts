// utils/ipfs.ts
// Safe IPFS upload helper that uses your backend proxy (no Pinata keys in the browser)

import { SOLANA_CONFIG } from "../lib/solana-config";

export type IpfsUploadResult = {
  cid: string;        // raw CID (IpfsHash)
  url: string;        // gateway URL for previews / metadata
  raw?: unknown;      // full Pinata response (optional)
};

/**
 * Upload an image file to IPFS via your backend proxy.
 * Enforces a 2MB limit (adjust if you raise limits on the backend).
 */
export async function uploadImageToIPFS(file: File): Promise<IpfsUploadResult> {
  if (!file) throw new Error("No file provided");
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("File too large (max 2MB)");
  }

  const form = new FormData();
  form.append("file", file);

  const apiBase = SOLANA_CONFIG.apiBase || "http://localhost:3001";
  const res = await fetch(`${apiBase}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upload failed (${res.status}): ${text}`);
  }

  // Expected backend response shape from Pinata:
  // { IpfsHash: "Qm...", PinSize: number, Timestamp: string }
  const data: any = await res.json();
  const cid: string = data?.IpfsHash;
  if (!cid) throw new Error("Upload succeeded but IpfsHash missing in response");

  const gateway = SOLANA_CONFIG.gateway || "https://gateway.pinata.cloud/ipfs/";
  const url = `${gateway}${cid}`;

  return { cid, url, raw: data };
}

