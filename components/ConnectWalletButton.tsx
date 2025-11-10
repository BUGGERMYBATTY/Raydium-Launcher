
import React from 'react';

interface ConnectWalletButtonProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  if (walletAddress) {
    const truncatedAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
    return (
      <div className="relative group">
        <button className="bg-solana-purple text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-solana-purple/90 transition-all duration-200">
          {truncatedAddress}
        </button>
        <div className="absolute top-full right-0 mt-2 w-40 bg-brand-surface rounded-md shadow-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={onDisconnect}
            className="w-full text-left px-3 py-2 text-sm text-brand-text-secondary hover:bg-brand-bg rounded-md"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      className="bg-gradient-to-r from-solana-green to-cyan-400 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:opacity-90 transition-opacity duration-200"
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWalletButton;
