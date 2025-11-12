import React, { useState, useCallback } from 'react';
// FIX: Import Buffer for browser environments to fix 'Cannot find name Buffer' error.
import { Buffer } from 'buffer';
import TokenForm from './components/TokenForm';
import TokenResult from './components/TokenResult';
import type { TokenData, CreatedTokenInfo } from './types';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Keypair, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction, createSetAuthorityInstruction, AuthorityType } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction, PROGRAM_ID as METADATA_PROGRAM_ID } from '@metaplex-foundation/mpl-token-metadata';
import { uploadMetadataToPinata } from './lib/pinata';

const TOKEN_DECIMALS = 9;
const TOKEN_SUPPLY = 1_000_000_000;
const CREATION_FEE_SOL = 0.05;
const FEE_RECIPIENT_ADDRESS = new PublicKey('CobrA111111111111111111111111111111111111111');

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<CreatedTokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const wallet = useWallet();
  const { connection } = useConnection();
  const { visible: isWalletModalVisible } = useWalletModal();

  const handleCreateToken = useCallback(async (data: TokenData) => {
    if (!wallet.publicKey || !wallet.sendTransaction) {
      setError("Wallet not connected. Please connect your wallet to continue.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      // 1. Upload metadata to Pinata
      const metadataUri = await uploadMetadataToPinata(data);
      
      // 2. Create new mint keypair
      const mintKeypair = Keypair.generate();
      const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

      // 3. Get Associated Token Account address
      const associatedTokenAddress = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        wallet.publicKey
      );

      // 4. Get Metadata PDA
      const [metadataPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('metadata'),
          METADATA_PROGRAM_ID.toBuffer(),
          mintKeypair.publicKey.toBuffer(),
        ],
        METADATA_PROGRAM_ID
      );
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: FEE_RECIPIENT_ADDRESS,
            lamports: CREATION_FEE_SOL * LAMPORTS_PER_SOL,
        }),
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          TOKEN_DECIMALS,
          wallet.publicKey,
          wallet.publicKey
        ),
        createCreateMetadataAccountV3Instruction(
          {
            metadata: metadataPda,
            mint: mintKeypair.publicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: data.name,
                symbol: data.symbol,
                uri: metadataUri,
                sellerFeeBasisPoints: 0,
                creators: null,
                collection: null,
                uses: null,
              },
              isMutable: true,
              collectionDetails: null,
            },
          }
        ),
        createAssociatedTokenAccountInstruction(
          wallet.publicKey,
          associatedTokenAddress,
          wallet.publicKey,
          mintKeypair.publicKey
        ),
        createMintToInstruction(
          mintKeypair.publicKey,
          associatedTokenAddress,
          wallet.publicKey,
          TOKEN_SUPPLY * Math.pow(10, TOKEN_DECIMALS)
        ),
        createSetAuthorityInstruction(
            mintKeypair.publicKey,
            wallet.publicKey,
            AuthorityType.MintTokens,
            null
        )
      );
      
      const signature = await wallet.sendTransaction(transaction, connection, {
        signers: [mintKeypair]
      });

      await connection.confirmTransaction(signature, 'confirmed');

      setCreatedTokenInfo({
        ...data,
        address: mintKeypair.publicKey.toBase58(),
        ownerAddress: wallet.publicKey.toBase58(),
        transactionSignature: signature,
      });
      setView('result');

    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'An unknown error occurred during token creation.');
    } finally {
      setIsLoading(false);
    }
  }, [wallet, connection]);


  const handleReset = useCallback(() => {
    setView('form');
    setCreatedTokenInfo(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen text-brand-text flex flex-col p-8 font-sans">
      <header className="w-full flex justify-between items-center mb-4">
        <img
          src="https://yellow-peculiar-cephalopod-560.mypinata.cloud/ipfs/bafybeidvxvxxx4tipwuymc4hyvjmxw5kt3psz4krqici475ick3jpmsuwa"
          alt="Cobra Launch"
          className="h-48"
        />
        <WalletMultiButton />
      </header>
      <main className="flex-grow flex items-center justify-center">
        {!wallet.connected ? (
          !isWalletModalVisible && (
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Create a Solana Token</h1>
              <p className="text-brand-text-secondary mb-8">No coding required. Launch your token in minutes.</p>
              <WalletMultiButton>Connect Wallet to Get Started</WalletMultiButton>
            </div>
          )
        ) : (
          <div className="w-full max-w-2xl bg-brand-surface-transparent p-8 rounded-2xl shadow-lg shadow-glow-green border border-brand-border">
            {view === 'form' && (
              <>
                <h1 className="text-3xl font-bold mb-2 text-center">Create a New Solana Token</h1>
                <p className="text-brand-text-secondary mb-4 text-center">Fill in the details below to mint your new token.</p>
                <p className="text-sm text-brand-text-secondary/80 mb-8 text-center">
                  Note: Token Supply, Decimals, and Authority settings are fixed.
                </p>
                <TokenForm onSubmit={handleCreateToken} isLoading={isLoading} />
                 {error && (
                  <div className="mt-4 p-4 bg-red-900/50 border border-red-500 text-red-300 rounded-lg text-sm">
                    <strong>Error:</strong> {error}
                  </div>
                )}
              </>
            )}
            {view === 'result' && createdTokenInfo && (
              <TokenResult tokenInfo={createdTokenInfo} onReset={handleReset} />
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;