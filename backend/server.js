import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory's .env file
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Configure multer for file uploads (in-memory storage)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware - CORS Configuration
const corsOptions = {
    origin: [
        'https://randygarsh.com',
        'https://www.randygarsh.com',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Security: Ensure JWT is configured
const PINATA_JWT = process.env.VITE_PINATA_JWT;
const DEDICATED_GATEWAY = process.env.VITE_PINATA_GATEWAY || "https://yellow-peculiar-cephalopod-560.mypinata.cloud";

if (!PINATA_JWT) {
    console.error('FATAL ERROR: VITE_PINATA_JWT is not configured in environment variables');
    process.exit(1);
}

// Helper functions
function sanitizeForFilename(input) {
    return input.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

function generateFileName(originalFileName, tokenName, tokenSymbol) {
    const extension = originalFileName.split('.').pop() || 'png';

    // Generate 6-digit random number (100000-999999)
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    // Calculate available space: 50 (max) - extension.length - 1 (dot) - 6 (random) - 2 (hyphens)
    const fixedLength = extension.length + 1 + 6 + 2; // e.g., 4 + 1 + 6 + 2 = 13
    const availableLength = 50 - fixedLength; // e.g., 50 - 13 = 37

    // Sanitize inputs
    let sanitizedName = sanitizeForFilename(tokenName);
    let sanitizedSymbol = sanitizeForFilename(tokenSymbol);

    // Allocate space: 60% for name, 40% for symbol
    const maxNameLength = Math.floor(availableLength * 0.6);
    const maxSymbolLength = availableLength - maxNameLength;

    // Truncate if necessary
    if (sanitizedName.length > maxNameLength) {
        sanitizedName = sanitizedName.substring(0, maxNameLength);
    }
    if (sanitizedSymbol.length > maxSymbolLength) {
        sanitizedSymbol = sanitizedSymbol.substring(0, maxSymbolLength);
    }

    // Build filename
    const filename = `${sanitizedName}-${sanitizedSymbol}-${randomNumber}.${extension}`;

    // Final safety check - ensure it's under 50 chars
    if (filename.length > 50) {
        console.warn(`Filename too long (${filename.length} chars), truncating: ${filename}`);
        // Emergency truncation - just use symbol and random
        return `${sanitizedSymbol.substring(0, 10)}-${randomNumber}.${extension}`;
    }

    return filename;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Cobra Launch Backend API is running' });
});

// Image upload endpoint
app.post('/api/upload-image', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { tokenName, tokenSymbol } = req.body;

        if (!tokenName || !tokenSymbol) {
            return res.status(400).json({ error: 'tokenName and tokenSymbol are required' });
        }

        const uniqueFileName = generateFileName(req.file.originalname, tokenName, tokenSymbol);

        console.log(`Uploading image: ${uniqueFileName} (${req.file.size} bytes, ${req.file.mimetype})`);

        // Create FormData for Pinata API
        const formData = new FormData();

        // Add file buffer to form data - Pinata requires specific format
        formData.append('file', req.file.buffer, {
            filename: uniqueFileName,
            contentType: req.file.mimetype,
            knownLength: req.file.size
        });

        // Add metadata as JSON string
        const pinataMetadata = {
            name: uniqueFileName,
            keyvalues: {
                tokenName,
                tokenSymbol,
                uploadType: 'token-image'
            }
        };
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

        // Add options as JSON string
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        // Upload to Pinata using axios
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders()
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        const ipfsUrl = `${DEDICATED_GATEWAY}/ipfs/${response.data.IpfsHash}`;

        console.log(`Image uploaded successfully: ${ipfsUrl}`);
        res.json({ success: true, url: ipfsUrl });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: error.message || 'Failed to upload image' });
    }
});

// Metadata upload endpoint
app.post('/api/upload-metadata', async (req, res) => {
    try {
        const { name, symbol, description, image } = req.body;

        if (!name || !symbol || !description || !image) {
            return res.status(400).json({ error: 'name, symbol, description, and image are required' });
        }

        const metadataJson = {
            name,
            symbol,
            description,
            image,
        };

        const uniqueFileName = `${sanitizeForFilename(symbol)}-metadata.json`;

        console.log(`Uploading metadata: ${uniqueFileName}`);

        // Create FormData for Pinata API
        const formData = new FormData();

        // Convert JSON to buffer and add to form data
        const jsonBuffer = Buffer.from(JSON.stringify(metadataJson));
        formData.append('file', jsonBuffer, {
            filename: uniqueFileName,
            contentType: 'application/json',
            knownLength: jsonBuffer.length
        });

        // Add metadata as JSON string
        const pinataMetadata = {
            name: uniqueFileName,
            keyvalues: {
                tokenName: name,
                tokenSymbol: symbol,
                uploadType: 'token-metadata'
            }
        };
        formData.append('pinataMetadata', JSON.stringify(pinataMetadata));

        // Add options as JSON string
        formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

        // Upload to Pinata using axios
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Authorization': `Bearer ${PINATA_JWT}`,
                ...formData.getHeaders()
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });

        const ipfsUrl = `${DEDICATED_GATEWAY}/ipfs/${response.data.IpfsHash}`;

        console.log(`Metadata uploaded successfully: ${ipfsUrl}`);
        res.json({ success: true, url: ipfsUrl });
    } catch (error) {
        console.error('Metadata upload error:', error);
        res.status(500).json({ error: error.message || 'Failed to upload metadata' });
    }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Cobra Launch Backend API running on port ${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔒 Pinata JWT: ${PINATA_JWT ? 'Configured ✓' : 'Missing ✗'}`);
});
