import React, { useState, useCallback } from 'react';
import TokenForm from './components/TokenForm';
import TokenResult from './components/TokenResult';
import type { TokenData, CreatedTokenInfo } from './types';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, useWalletModal } from '@solana/wallet-adapter-react-ui';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<CreatedTokenInfo | null>(null);
  const wallet = useWallet();
  const { visible: isWalletModalVisible } = useWalletModal();

  const handleCreateToken = useCallback((data: TokenData) => {
    if (!wallet.publicKey) {
      console.error("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const fakeAddress = 'TKN' + Array(41).join().replace(/(.|$)/g, () => (Math.random()*36|0).toString(36));
      
      setCreatedTokenInfo({
        ...data,
        address: fakeAddress,
        ownerAddress: wallet.publicKey!.toBase58(),
      });
      setIsLoading(false);
      setView('result');
    }, 2500);
  }, [wallet.publicKey]);

  const handleReset = useCallback(() => {
    setView('form');
    setCreatedTokenInfo(null);
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