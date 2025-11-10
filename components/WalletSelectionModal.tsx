import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface WalletSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletName: 'phantom' | 'solflare') => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({ isOpen, onClose, onSelectWallet }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-brand-surface rounded-2xl shadow-2xl p-8 m-4 w-full max-w-sm relative text-center border border-brand-primary/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-text-secondary hover:text-white transition-colors"
          aria-label="Close"
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Connect a Wallet</h2>
        
        <div className="space-y-4">
          <button 
            onClick={() => onSelectWallet('phantom')}
            className="w-full flex items-center p-4 bg-brand-bg hover:bg-brand-bg/70 rounded-lg transition-colors duration-200 border border-transparent hover:border-solana-purple"
          >
            <img src="https://mintcdn.com/phantom-e50e2e68/fkWrmnMWhjoXSGZ9/resources/images/Phantom_SVG_Icon.svg?w=840&fit=max&auto=format&n=fkWrmnMWhjoXSGZ9&q=85&s=7311f84864aeebc085a674acff85ff99" alt="Phantom Wallet" className="h-8 w-8 rounded-full mr-4" />
            <span className="font-semibold text-lg">Phantom</span>
          </button>
          <button 
            onClick={() => onSelectWallet('solflare')}
            className="w-full flex items-center p-4 bg-brand-bg hover:bg-brand-bg/70 rounded-lg transition-colors duration-200 border border-transparent hover:border-solana-purple"
          >
            <img src="https://solflare.com/favicon.ico" alt="Solflare Wallet" className="h-8 w-8 rounded-full mr-4" />
            <span className="font-semibold text-lg">Solflare</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletSelectionModal;