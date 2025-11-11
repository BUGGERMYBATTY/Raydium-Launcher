import { SOLANA_CONFIG } from "../lib/solana-config";

export async function uploadImageToIPFS(file: File) {
  if (!file) throw new Error("No file provided");
  if (file.size > 2 * 1024 * 1024) throw new Error("File too large (max 2MB)");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${SOLANA_CONFIG.apiBase}/api/upload`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Upload failed: ${res.status} ${err}`);
  }

  const data = await res.json();
  const cid = data.cid || data.IpfsHash || data.ipfsHash;
  const url = `${SOLANA_CONFIG.gateway}${cid}`;
  return { cid, url };
}
