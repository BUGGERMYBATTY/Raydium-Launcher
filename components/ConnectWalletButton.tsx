import React from 'react';
<<<<<<< HEAD
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletConnection } from '../hooks/useWalletConnection';

const ConnectWalletButton: React.FC = () => {
  const { walletAddress, connected, disconnect } = useWalletConnection();
  const { setVisible } = useWalletModal();

  const handleConnect = () => {
    setVisible(true);
  };

  if (connected && walletAddress) {
=======

interface ConnectWalletButtonProps {
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ walletAddress, onConnect, onDisconnect }) => {
  if (walletAddress) {
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
    const truncatedAddress = `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
    return (
      <div className="relative group">
        <button className="bg-brand-surface border border-brand-border text-brand-text font-semibold py-2 px-4 rounded-lg shadow-md hover:border-brand-accent transition-all duration-200">
          {truncatedAddress}
        </button>
<<<<<<< HEAD
        <div className="absolute top-full right-0 mt-2 w-40 bg-brand-surface border border-brand-border rounded-md shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
          <button
            onClick={disconnect}
=======
        <div className="absolute top-full right-0 mt-2 w-40 bg-brand-surface border border-brand-border rounded-md shadow-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={onDisconnect}
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
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
<<<<<<< HEAD
      onClick={handleConnect}
=======
      onClick={onConnect}
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
      className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-brand-accent-hover transition-all duration-200"
    >
      Connect Wallet
    </button>
  );
};

<<<<<<< HEAD
export default ConnectWalletButton;
=======
export default ConnectWalletButton;
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
