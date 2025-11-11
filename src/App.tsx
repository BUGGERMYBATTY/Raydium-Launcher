import { useState } from "react";
import { uploadImageToIPFS } from "./utils/ipfs";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  async function handleUpload() {
    try {
      setStatus("Uploading...");
      setUrl("");
      if (!file) throw new Error("Pick a file first");
      const { url } = await uploadImageToIPFS(file);
      setUrl(url);
      setStatus("Done!");
    } catch (e: any) {
      setStatus(e.message || "Upload failed");
    }
  }

  return (
    <div style={{ padding: 24, color: "#eaeaea", fontFamily: "sans-serif" }}>
      <h2>Vyper Launcher – IPFS Upload Test</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <div style={{ marginTop: 12 }}>
        <button onClick={handleUpload} style={{ padding: "8px 14px" }}>
          Upload to IPFS
        </button>
      </div>
      <div style={{ marginTop: 12 }}>{status}</div>
      {url && (
        <div style={{ marginTop: 12 }}>
          <div>
            Link:{" "}
            <a href={url} target="_blank" rel="noreferrer">
              {url}
            </a>
          </div>
          <img
            src={url}
            alt="preview"
            style={{ display: "block", marginTop: 12, maxWidth: 320 }}
          />
        </div>
      )}
    </div>
  );
}
