// IMPORTANT: This file represents a secure backend API endpoint.
// In a real-world application, this code would be deployed as a serverless function
// (e.g., on Vercel, Netlify, or AWS Lambda). The frontend would then call this
// endpoint using `fetch`. The PINATA_JWT would be stored as a secure environment
// variable on the server, NOT hardcoded.

import type { TokenData } from '../types';

// Load configuration from environment variables
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjODk5NjkzOC1mYjljLTQ2M2UtOGU2ZC1jYWYzMjIzN2Y3YTAiLCJlbWFpbCI6Impvbm55c2FsZWVuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1ZmYyNzk4OWIyNWEyNDkzYWFlMSIsInNjb3BlZEtleVNlY3JldCI6IjJmMGI0MzBkMGNmNmM2ZDg0YzQ5NWFkMmYxMGFkMGUwOTIwM2NiZjFjYzRkOGQzNDhlNmRhNzUwNWMwNTAyM2YiLCJleHAiOjE3OTQzMzIxMzd9._UQpOPAJoIiIVPIZ-qzkWPlUSutgQoJZODLkOUALj3Q";
const DEDICATED_GATEWAY = import.meta.env.VITE_PINATA_GATEWAY || "https://yellow-peculiar-cephalopod-560.mypinata.cloud";

function sanitizeForFilename(input: string): string {
    return input.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
}

function generateFileName(originalFileName: string, tokenName: string, tokenSymbol: string): string {
    const extension = originalFileName.split('.').pop() || 'png';
    const sanitizedName = sanitizeForFilename(tokenName);
    const sanitizedSymbol = sanitizeForFilename(tokenSymbol);
    const randomNumber = Math.floor(Math.random() * 1_000_000_000);
    return `${sanitizedName}-${sanitizedSymbol}-${randomNumber}.${extension}`;
}

async function handleImageUpload(file: File, tokenName: string, tokenSymbol: string): Promise<string> {
    const formData = new FormData();
    const uniqueFileName = generateFileName(file.name, tokenName, tokenSymbol);
    formData.append('file', file, uniqueFileName);

    const metadata = JSON.stringify({
        name: uniqueFileName,
        keyvalues: { tokenName, tokenSymbol, uploadType: 'token-image' }
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', options);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata API Error: ${errorData.error?.reason || response.statusText}`);
    }

    const result = await response.json();
    return `${DEDICATED_GATEWAY}/ipfs/${result.IpfsHash}`;
}

async function handleMetadataUpload(metadata: TokenData): Promise<string> {
    const metadataJson = {
        name: metadata.name,
        symbol: metadata.symbol,
        description: metadata.description,
        image: metadata.image,
    };
    
    const uniqueFileName = `${sanitizeForFilename(metadata.symbol)}-metadata.json`;
    const blob = new Blob([JSON.stringify(metadataJson)], { type: 'application/json' });
    const file = new File([blob], uniqueFileName);

    const formData = new FormData();
    formData.append('file', file);
    
    const pinataMetadata = JSON.stringify({
        name: uniqueFileName,
        keyvalues: { tokenName: metadata.name, tokenSymbol: metadata.symbol, uploadType: 'token-metadata' }
    });
    formData.append('pinataMetadata', pinataMetadata);

    const options = JSON.stringify({ cidVersion: 0 });
    formData.append('pinataOptions', options);

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: { Authorization: `Bearer ${PINATA_JWT}` },
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Pinata API Error: ${errorData.error?.reason || response.statusText}`);
    }

    const result = await response.json();
    return `${DEDICATED_GATEWAY}/ipfs/${result.IpfsHash}`;
}

// This is the exported "API handler" that the frontend will call.
export const uploadToPinata = async (
    type: 'image' | 'metadata',
    data: File | TokenData,
    tokenName?: string,
    tokenSymbol?: string
): Promise<string> => {
    if (type === 'image') {
        if (!(data instanceof File) || !tokenName || !tokenSymbol) {
            throw new Error('Invalid data for image upload.');
        }
        return handleImageUpload(data, tokenName, tokenSymbol);
    } else if (type === 'metadata') {
        if (data instanceof File) {
             throw new Error('Invalid data for metadata upload.');
        }
        return handleMetadataUpload(data as TokenData);
    } else {
        throw new Error('Invalid upload type specified.');
    }
};
