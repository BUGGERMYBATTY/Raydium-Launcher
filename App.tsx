import React, { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import TokenForm from './components/TokenForm';
import TokenResult from './components/TokenResult';
import ConnectWalletButton from './components/ConnectWalletButton';
import { WalletContextProvider } from './components/WalletContextProvider';
import type { TokenData, CreatedTokenInfo } from './types';
import { uploadTokenAssets } from './utils/ipfs';
import { createToken } from './utils/token-creation';
import { SOLANA_NETWORK } from './lib/solana-config';

const AppContent: React.FC = () => {
  const [view, setView] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<CreatedTokenInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { publicKey, connected, signTransaction } = useWallet();

  const handleCreateToken = useCallback(async (data: TokenData) => {
    if (!connected || !publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Upload image and metadata to IPFS
      console.log('Uploading assets to IPFS...');
      const { imageUri, metadataUri } = await uploadTokenAssets(
        data.name,
        data.symbol,
        data.description,
        data.image.file
      );
      console.log('Assets uploaded:', { imageUri, metadataUri });

      // Step 2: Create token on Solana
      console.log('Creating token on Solana...');
      const result = await createToken(
        {
          name: data.name,
          symbol: data.symbol,
          metadataUri,
          payer: publicKey,
        },
        signTransaction
      );
      console.log('Token created:', result);

      // Step 3: Set result and show success
      setCreatedTokenInfo({
        ...data,
        address: result.mintAddress,
        ownerAddress: publicKey.toBase58(),
        signature: result.signature,
        metadataUri,
        imageUri,
      });
      setView('result');
    } catch (err) {
      console.error('Error creating token:', err);
      setError(err instanceof Error ? err.message : 'Failed to create token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [connected, publicKey, signTransaction]);

  const handleReset = useCallback(() => {
    setView('form');
    setCreatedTokenInfo(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        {/* Wallet Button */}
        <div className="flex justify-end w-full mb-4 h-10">
          <ConnectWalletButton />
        </div>
        
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent-hover to-brand-accent">
                VYPER
              </span>
              <span className="text-brand-text">
                {' '}LAUNCHER
              </span>
            </h1>
          </div>
          <p className="text-brand-text-secondary text-lg">
            Launch. Wait. Strike!
          </p>
          {SOLANA_NETWORK !== 'mainnet-beta' && (
            <div className="mt-2 inline-block bg-yellow-500/20 border border-yellow-500/50 rounded-lg px-3 py-1">
              <p className="text-yellow-500 text-sm font-medium">
                ⚠️ {SOLANA_NETWORK.toUpperCase()} Mode
              </p>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="bg-brand-surface border border-brand-border rounded-2xl shadow-2xl shadow-brand-accent/10 p-6 md:p-10 transition-all duration-300 min-h-[480px] flex flex-col items-center justify-center">
          {/* Error Display */}
          {error && (
            <div className="w-full mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <p className="text-red-500 text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {connected ? (
            <div className="w-full">
              {view === 'form' ? (
                <TokenForm onSubmit={handleCreateToken} isLoading={isLoading} />
              ) : createdTokenInfo ? (
                <TokenResult tokenInfo={createdTokenInfo} onReset={handleReset} />
              ) : null}
            </div>
          ) : (
            <div className="text-center animate-fade-in">
              <div className="mb-6">
                <svg 
                  className="mx-auto h-16 w-16 text-brand-accent" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" 
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-brand-text mb-2">
                Connect Your Wallet
              </h2>
              <p className="text-brand-text-secondary/80 mb-6 max-w-md mx-auto">
                Connect your Solana wallet to create and launch your SPL token on the blockchain.
              </p>
              <div className="flex flex-col items-center gap-4">
                <ConnectWalletButton />
                <p className="text-xs text-brand-text-secondary">
                  Supported: Phantom, Solflare, and more
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-brand-text-secondary">
          <p>Launch your token on the Solana ecosystem.</p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Vyper Launcher. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WalletContextProvider>
      <AppContent />
    </WalletContextProvider>
  );
};

export default App;
