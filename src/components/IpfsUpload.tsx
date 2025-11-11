import React, { useState } from "react";
import { uploadImageToIPFS } from "@/utils/ipfs"; // thanks to alias

export default function IpfsUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCid(null); setUrl(null); setError(null);
    setFile(e.target.files?.[0] || null);
  };

  const onUpload = async () => {
    try {
      if (!file) throw new Error("Choose a file first");
      setLoading(true);
      const { cid, url } = await uploadImageToIPFS(file);
      setCid(cid); setUrl(url);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 520, margin: "24px auto", padding: 16, border: "1px solid #333", borderRadius: 12}}>
      <h3 style={{marginTop: 0}}>Upload to IPFS (via backend)</h3>
      <input type="file" accept="image/*" onChange={onChange} />
      <div style={{marginTop: 12}}>
        <button onClick={onUpload} disabled={!file || loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {cid && (
        <div style={{marginTop: 12, wordBreak: "break-all"}}>
          <div><b>CID:</b> {cid}</div>
          {url && (
            <>
              <div><b>URL:</b> <a href={url} target="_blank" rel="noreferrer">{url}</a></div>
              <div style={{marginTop: 12}}>
                <img src={url} alt="preview" style={{maxWidth: "100%", borderRadius: 8}} />
              </div>
            </>
          )}
        </div>
      )}
      {error && <div style={{marginTop: 12, color: "tomato"}}>{error}</div>}
    </div>
  );
}
