import express from "express";
import multer from "multer";
import axios from "axios";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import FormData from "form-data";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
}));
const upload = multer({ dest: "uploads/" });

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const data = new FormData();
    data.append("file", fs.createReadStream(req.file.path));

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: "Infinity",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...data.getHeaders(),
        },
      }
    );

    // Clean up uploaded temp file
    fs.unlink(req.file.path, () => {});

    return res.json({
      cid: response.data.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
    });
  } catch (err) {
    console.error("❌ /api/upload error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to upload image to IPFS",
      details: err.response?.data || err.message,
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

