export interface TokenData {
  name: string;
  symbol: string;
  description: string;
  image: {
    file: File;
    previewUrl: string;
  };
}

export interface CreatedTokenInfo extends TokenData {
  address: string;
  ownerAddress: string;
  signature?: string;
  metadataUri?: string;
  imageUri?: string;
}
