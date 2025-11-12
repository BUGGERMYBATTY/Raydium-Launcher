import React, { useState, useCallback } from 'react';
import TokenForm from './components/TokenForm';
import TokenResult from './components/TokenResult';
import type { TokenData, CreatedTokenInfo } from './types';
import ConnectWalletButton from './components/ConnectWalletButton';
import WalletSelectionModal from './components/WalletSelectionModal';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'result'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<CreatedTokenInfo | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const handleOpenWalletModal = useCallback(() => {
    setIsWalletModalOpen(true);
  }, []);
  
  const handleCloseWalletModal = useCallback(() => {
    setIsWalletModalOpen(false);
  }, []);

  const handleWalletSelect = useCallback((walletName: 'phantom' | 'solflare') => {
    setIsWalletModalOpen(false);
    // Simulate connecting to the selected wallet
    const prefix = walletName === 'phantom' ? 'PhAn' : 'SoLf';
    const fakeWalletAddress = prefix + Array(40).join().replace(/(.|$)/g, () => (Math.random()*36|0).toString(36));
    setWalletAddress(fakeWalletAddress);
  }, []);

  const handleDisconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setView('form');
    setCreatedTokenInfo(null);
  }, []);

  const handleCreateToken = useCallback((data: TokenData) => {
    if (!walletAddress) {
      console.error("Wallet not connected");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const fakeAddress = 'TKN' + Array(41).join().replace(/(.|$)/g, () => (Math.random()*36|0).toString(36));
      
      setCreatedTokenInfo({
        ...data,
        address: fakeAddress,
        ownerAddress: walletAddress,
      });
      setIsLoading(false);
      setView('result');
    }, 2500);
  }, [walletAddress]);

  const handleReset = useCallback(() => {
    setView('form');
    setCreatedTokenInfo(null);
  }, []);

  return (
    <>
      <div className="min-h-screen text-brand-text flex flex-col p-8 font-sans">
        <header className="w-full flex justify-between items-center mb-4">
          <img
            src="https://yellow-peculiar-cephalopod-560.mypinata.cloud/ipfs/bafybeidvxvxxx4tipwuymc4hyvjmxw5kt3psz4krqici475ick3jpmsuwa"
            alt="Cobra Launch"
            className="h-48"
          />
          <ConnectWalletButton 
            walletAddress={walletAddress} 
            onConnect={handleOpenWalletModal} 
            onDisconnect={handleDisconnectWallet} 
          />
        </header>
        <main className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-2xl bg-brand-surface p-8 rounded-2xl shadow-lg border border-brand-border">
            {view === 'form' && !walletAddress && (
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Create a Solana Token</h1>
                    <p className="text-brand-text-secondary mb-8">No coding required. Launch your token in minutes.</p>
                    <button 
                        onClick={handleOpenWalletModal}
                        className="bg-brand-accent text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-brand-accent-hover transition-all duration-200 text-lg"
                    >
                        Connect Wallet to Get Started
                    </button>
                </div>
            )}
            {view === 'form' && walletAddress && (
              <>
                <h1 className="text-3xl font-bold mb-2 text-center">Create a New Solana Token</h1>
                <p className="text-brand-text-secondary mb-4 text-center">Fill in the details below to mint your new token.</p>
                <p className="text-sm text-brand-text-secondary/80 mb-8 text-center">
                  Please note: Token Supply, Decimals, and Authority settings are set by default and cannot be changed.
                </p>
                <TokenForm onSubmit={handleCreateToken} isLoading={isLoading} />
              </>
            )}
            {view === 'result' && createdTokenInfo && (
              <TokenResult tokenInfo={createdTokenInfo} onReset={handleReset} />
            )}
          </div>
        </main>
      </div>

      <WalletSelectionModal 
        isOpen={isWalletModalOpen}
        onClose={handleCloseWalletModal}
        onSelectWallet={handleWalletSelect}
      />
    </>
  );
};

export default App;