// This module simulates a backend service for handling image uploads to Pinata.
// In a real-world application, this logic would live on a secure server (e.g., a serverless function)
// and the JWT would be stored as an environment variable, never exposed to the client.

import type { TokenData } from '../types';

const PINATA_JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjODk5NjkzOC1mYjljLTQ2M2UtOGU2ZC1jYWYzMjIzN2Y3YTAiLCJlbWFpbCI6Impvbm55c2FsZWVuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI1ZmYyNzk4OWIyNWEyNDkzYWFlMSIsInNjb3BlZEtleVNlY3JldCI6IjJmMGI0MzBkMGNmNmM2ZDg0YzQ5NWFkMmYxMGFkMGUwOTIwM2NiZjFjYzRkOGQzNDhlNmRhNzUwNWMwNTAyM2YiLCJleHAiOjE3OTQzMzIxMzd9._UQpOPAJoIiIVPIZ-qzkWPlUSutgQoJZODLkOUALj3Q";
const DEDICATED_GATEWAY = "https://yellow-peculiar-cephalopod-560.mypinata.cloud";

export async function uploadImageToPinata(file: File): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("Pinata JWT is not set in the backend.");
  }

  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({ name: file.name });
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
  formData.append('file', file, 'metadata.json');

  const pinataMetadata = JSON.stringify({ name: `${metadata.symbol}-metadata.json` });
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
