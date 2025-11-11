<<<<<<< HEAD
=======

>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
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
<<<<<<< HEAD
  signature?: string;
  metadataUri?: string;
  imageUri?: string;
=======
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
}
