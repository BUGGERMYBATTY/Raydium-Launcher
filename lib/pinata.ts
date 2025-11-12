// This module simulates a backend service for handling image uploads to Pinata.
// In a real-world application, this logic would live on a secure server (e.g., a serverless function)
// and the JWT would be stored as an environment variable, never exposed to the client.

import type { TokenData } from '../types';

const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjODk5NjkzOC1mYjljLTQ2M2UtOGU2ZC1jYWYzMjIzN2Y3YTAiLCJlbWFpbCI6Impvbm55c2FsZWVuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1ZmYyNzk4OWIyNWEyNDkzYWFlMSIsInNjb3BlZEtleVNlY3JldCI6IjJmMGI0MzBkMGNmNmM2ZDg0YzQ5NWFkMmYxMGFkMGUwOTIwM2NiZjFjYzRkOGQzNDhlNmRhNzUwNWMwNTAyM2YiLCJleHAiOjE3OTQzMzIxMzd9._UQpOPAJoIiIVPIZ-qzkWPlUSutgQoJZODLkOUALj3Q";
const DEDICATED_GATEWAY = "https://yellow-peculiar-cephalopod-560.mypinata.cloud";

const generateFileName = (tokenName: string, tokenSymbol: string, originalFileName: string): string => {
  const extension = originalFileName.split('.').pop() || '';
  const randomString = Math.floor(1000000 + Math.random() * 9000000).toString(); // 7-digit number string
  
  // Sanitize inputs to be filename-friendly and reasonably short
  const sanitizedName = tokenName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 20);
  const sanitizedSymbol = tokenSymbol.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 10);
  
  const baseName = `${sanitizedName || 'token'}-${sanitizedSymbol || 'symbol'}-${randomString}`;
  let finalName = `${baseName}.${extension}`;

  // Enforce a length limit (e.g., 50 chars) to be safe with Pinata
  if (finalName.length > 50) {
    const extLength = extension.length > 0 ? extension.length + 1 : 0;
    const availableLength = 50 - extLength;
    finalName = `${baseName.slice(0, availableLength)}.${extension}`;
  }
  
  return finalName;
};

export async function uploadImageToPinata(file: File, tokenName: string, tokenSymbol: string): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT is not set in the backend.");
  }

  const newFileName = generateFileName(tokenName, tokenSymbol, file.name);
  const renamedFile = new File([file], newFileName, { type: file.type });

  const formData = new FormData();
  formData.append('file', renamedFile);

  const metadata = JSON.stringify({ name: renamedFile.name });
  formData.append('pinataMetadata', metadata);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to upload image to Pinata: ${errorData}`);
  }

  const data = await res.json();
  const ipfsUrl = `${DEDICATED_GATEWAY}/ipfs/${data.IpfsHash}`;
  return ipfsUrl;
}

export async function uploadMetadataToPinata(metadata: Omit<TokenData, 'description'> & {description: string}): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT is not set in the backend.");
  }
  
  const metadataJson = {
    name: metadata.name,
    symbol: metadata.symbol,
    description: metadata.description,
    image: metadata.image,
  };

  const file = new Blob([JSON.stringify(metadataJson)], { type: 'application/json' });
  const formData = new FormData();
  
  const metadataFileName = generateFileName(metadata.name, metadata.symbol, 'metadata.json');

  formData.append('file', file, metadataFileName);

  const pinataMetadata = JSON.stringify({ name: metadataFileName });
  formData.append('pinataMetadata', pinataMetadata);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Failed to upload metadata to Pinata: ${errorData}`);
  }

  const data = await res.json();
  const ipfsUrl = `${DEDICATED_GATEWAY}/ipfs/${data.IpfsHash}`;
  return ipfsUrl;
}