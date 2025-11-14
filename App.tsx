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
const CREATION_FEE_SOL = 0.1;

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<CreatedTokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [tokenDataToConfirm, setTokenDataToConfirm] = useState<TokenData | null>(null);
  
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
      // SAFEGUARD: Explicitly block transactions to the known incorrect address.
      const FORBIDDEN_ADDRESS = "CobrA111111111111111111111111111111111111111";
      if (data.treasuryAddress.trim() === FORBIDDEN_ADDRESS) {
          throw new Error("CRITICAL ERROR: Attempted to send fee to a hardcoded incorrect address. Aborting transaction.");
      }

      // 0. Set fee recipient
      const feeRecipient = new PublicKey(data.treasuryAddress);

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
            toPubkey: feeRecipient,
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

  const handleFormSubmit = (data: TokenData) => {
    setTokenDataToConfirm(data);
    setIsConfirmModalOpen(true);
  };

  const confirmAndCreateToken = async () => {
    if (tokenDataToConfirm) {
      setIsConfirmModalOpen(false);
      await handleCreateToken(tokenDataToConfirm);
      setTokenDataToConfirm(null);
    }
  };

  const handleReset = useCallback(() => {
    setView('form');
    setCreatedTokenInfo(null);
    setError(null);
  }, []);

  // Get network name from environment variable for display
  const networkName = (import.meta.env.VITE_SOLANA_NETWORK || 'mainnet-beta').toUpperCase();
  const isMainnet = networkName === 'MAINNET-BETA';

  return (
    <div className="min-h-screen text-brand-text flex flex-col p-8 font-sans">
      <header className="w-full flex justify-between items-center mb-4">
        <img
          src="https://yellow-peculiar-cephalopod-560.mypinata.cloud/ipfs/bafybeidvxvxxx4tipwuymc4hyvjmxw5kt3psz4krqici475ick3jpmsuwa"
          alt="Cobra Launch"
          className="h-48"
        />
        <div className="flex items-center gap-4">
          <div className={`text-sm font-semibold rounded-full px-4 py-1.5 ${
            isMainnet
              ? 'text-green-300 bg-green-900/50 border border-green-500'
              : 'text-purple-300 bg-purple-900/50 border border-purple-500'
          }`}>
            {isMainnet ? 'Mainnet' : networkName}
          </div>
          <WalletMultiButton />
        </div>
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
                <TokenForm onSubmit={handleFormSubmit} isLoading={isLoading} isConfirmModalOpen={isConfirmModalOpen} />
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

      {isConfirmModalOpen && tokenDataToConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center animate-fade-in p-4">
          <div className="bg-brand-surface rounded-2xl shadow-2xl p-8 m-4 w-full max-w-lg relative border border-brand-accent/50">
            <h2 className="text-2xl font-bold mb-4 text-brand-text">Confirm Transaction</h2>
            <p className="text-brand-text-secondary mb-6">Please review the details below before proceeding.</p>
            
            <div className="space-y-4 text-left bg-brand-bg-transparent p-4 rounded-lg border border-brand-border mb-6">
              <div>
                <label className="text-xs font-mono text-brand-text-secondary">TOKEN NAME</label>
                <p className="text-brand-text">{tokenDataToConfirm.name}</p>
              </div>
              <div>
                <label className="text-xs font-mono text-brand-text-secondary">TOKEN SYMBOL</label>
                <p className="text-brand-text">{tokenDataToConfirm.symbol}</p>
              </div>
              <div>
                <label className="text-xs font-mono text-red-400 font-bold">FEE RECIPIENT (TREASURY)</label>
                <p className="text-brand-text font-mono break-all bg-brand-surface p-2 rounded mt-1">{tokenDataToConfirm.treasuryAddress}</p>
              </div>
              <div>
                <label className="text-xs font-mono text-red-400 font-bold">FEE AMOUNT</label>
                <p className="font-bold text-brand-accent">0.1 SOL</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsConfirmModalOpen(false)} disabled={isLoading} className="py-2 px-4 border border-brand-border rounded-lg text-sm font-medium text-brand-text-secondary hover:border-brand-accent transition-colors disabled:opacity-50">Cancel</button>
              <button onClick={confirmAndCreateToken} disabled={isLoading} className="w-40 flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50">
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Confirm & Create'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
