import React, { useState, useCallback } from 'react';
import type { CreatedTokenInfo } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface TokenResultProps {
  tokenInfo: CreatedTokenInfo;
  onReset: () => void;
}

const TokenResult: React.FC<TokenResultProps> = ({ tokenInfo, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tokenInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tokenInfo.address]);
  
  const explorerUrl = `https://solscan.io/tx/${tokenInfo.transactionSignature}?cluster=devnet`;

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-brand-accent mb-4">Token Created Successfully!</h2>
      <p className="text-brand-text-secondary mb-4">
        Your new Solana token is live on the Solana blockchain.
      </p>
       <div className="text-sm text-brand-text-secondary mb-8">
        Transaction successful. View on explorer: {' '}
        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-brand-accent-hover hover:underline">
          {tokenInfo.transactionSignature.slice(0, 8)}...{tokenInfo.transactionSignature.slice(-8)}
        </a>
      </div>

      <div className="bg-brand-bg-transparent rounded-xl p-6 mb-8 border border-brand-border flex flex-col md:flex-row items-center gap-6 shadow-glow-green">
        <img src={tokenInfo.image} alt={tokenInfo.name} className="h-24 w-24 rounded-full object-cover border-4 border-brand-accent flex-shrink-0" />
        <div className="text-left flex-grow w-full">
          <h3 className="text-2xl font-bold text-brand-text">{tokenInfo.name} ({tokenInfo.symbol})</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-mono text-brand-text-secondary">TOKEN ADDRESS</label>
              <div className="flex items-center gap-2">
                <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface-transparent p-2 rounded-md flex-grow">{tokenInfo.address}</p>
                <button onClick={handleCopy} className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-accent hover:bg-brand-accent-hover text-white">
                  {copied ? (
                    <>
                      <CheckIcon className="h-5 w-5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-5 w-5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-brand-text-secondary">OWNER / AUTHORITY</label>
              <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface-transparent p-2 rounded-md">{tokenInfo.ownerAddress}</p>
            </div>
             <div>
              <label className="text-xs font-mono text-brand-text-secondary">TREASURY ADDRESS (FEE RECIPIENT)</label>
              <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface-transparent p-2 rounded-md">{tokenInfo.treasuryAddress}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-bg-transparent p-6 rounded-lg text-left border border-brand-border shadow-glow-green">
        <h3 className="font-semibold text-xl mb-4 text-brand-accent">Next Steps: Launch on Raydium</h3>
        <ol className="list-decimal list-inside space-y-2 text-brand-text-secondary">
          <li>Go to the <a href="https://raydium.io/liquidity/create/" target="_blank" rel="noopener noreferrer" className="text-brand-accent-hover hover:underline">Raydium Create Pool</a> page.</li>
          <li>Connect your wallet.</li>
          <li>Paste your new token address to set up the liquidity pool.</li>
          <li>Follow the instructions on Raydium to complete the launch.</li>
        </ol>
      </div>

      <button onClick={onReset} className="mt-8 w-full py-3 px-4 border border-brand-accent rounded-lg shadow-sm text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent transition-colors duration-300">
        Create Another Token
      </button>
    </div>
  );
};

export default TokenResult;