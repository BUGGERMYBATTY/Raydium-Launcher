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
      <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex justify-end w-full mb-4 h-10">
            {walletAddress && (
              <ConnectWalletButton 
                walletAddress={walletAddress}
                onConnect={handleOpenWalletModal}
                onDisconnect={handleDisconnectWallet}
              />
            )}
          </div>
          
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
          </header>

          <main className="bg-brand-surface border border-brand-border rounded-2xl shadow-2xl shadow-brand-accent/10 p-6 md:p-10 transition-all duration-300 min-h-[480px] flex flex-col items-center justify-center">
            {walletAddress ? (
              <div className="w-full">
                {view === 'form' ? (
                  <TokenForm onSubmit={handleCreateToken} isLoading={isLoading} />
                ) : createdTokenInfo ? (
                  <TokenResult tokenInfo={createdTokenInfo} onReset={handleReset} />
                ) : null}
              </div>
            ) : (
              <div className="text-center animate-fade-in">
                <h2 className="text-2xl font-semibold text-brand-text-secondary">Please connect your wallet</h2>
                <p className="mt-2 text-brand-text-secondary/80">Your wallet is required to set token authority.</p>
                <button
                  onClick={handleOpenWalletModal}
                  className="mt-6 bg-brand-accent text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-brand-accent/20 hover:bg-brand-accent-hover hover:shadow-glow-green transition-all duration-300"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </main>

          <footer className="text-center mt-8 text-sm text-brand-text-secondary">
            <p>Launch your token on the Solana ecosystem.</p>
            <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
          </footer>
        </div>
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