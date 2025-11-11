import React, { useState, useCallback } from 'react';
import type { CreatedTokenInfo } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
<<<<<<< HEAD
import { getExplorerUrl } from '../lib/solana-config';
=======
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f

interface TokenResultProps {
  tokenInfo: CreatedTokenInfo;
  onReset: () => void;
}

const TokenResult: React.FC<TokenResultProps> = ({ tokenInfo, onReset }) => {
<<<<<<< HEAD
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedTx, setCopiedTx] = useState(false);

  const handleCopyAddress = useCallback(() => {
    navigator.clipboard.writeText(tokenInfo.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  }, [tokenInfo.address]);

  const handleCopyTx = useCallback(() => {
    if (tokenInfo.signature) {
      navigator.clipboard.writeText(tokenInfo.signature);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    }
  }, [tokenInfo.signature]);

  return (
    <div className="text-center animate-fade-in">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/20 mb-4">
          <CheckIcon className="h-8 w-8 text-brand-accent" />
        </div>
        <h2 className="text-3xl font-bold text-brand-accent mb-2">Token Created Successfully!</h2>
        <p className="text-brand-text-secondary">
          Your new SPL token is live on the Solana blockchain.
        </p>
      </div>

      <div className="bg-brand-bg rounded-xl p-6 mb-6 border border-brand-border">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src={tokenInfo.imageUri || tokenInfo.image?.previewUrl} 
            alt={tokenInfo.name} 
            className="h-24 w-24 rounded-full object-cover border-4 border-brand-accent flex-shrink-0" 
          />
          <div className="text-left flex-grow w-full">
            <h3 className="text-2xl font-bold text-brand-text mb-4">
              {tokenInfo.name} ({tokenInfo.symbol})
            </h3>
            
            {/* Token Address */}
            <div className="mb-3">
              <label className="text-xs font-mono text-brand-text-secondary block mb-1">
                TOKEN ADDRESS
              </label>
              <div className="flex items-center gap-2">
                <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface/50 p-2 rounded-md flex-grow">
                  {tokenInfo.address}
                </p>
                <button 
                  onClick={handleCopyAddress} 
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-accent hover:bg-brand-accent-hover text-white"
                >
                  {copiedAddress ? (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Copied</span>
                    </>
                  ) : (
                    <>
                      <CopyIcon className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy</span>
=======
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(tokenInfo.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tokenInfo.address]);

  return (
    <div className="text-center animate-fade-in">
      <h2 className="text-3xl font-bold text-brand-accent mb-4">Token Created Successfully!</h2>
      <p className="text-brand-text-secondary mb-8">
        Your new SPL token is live on the Solana blockchain.
      </p>

      <div className="bg-brand-bg rounded-xl p-6 mb-8 border border-brand-border flex flex-col md:flex-row items-center gap-6">
        <img src={tokenInfo.image.previewUrl} alt={tokenInfo.name} className="h-24 w-24 rounded-full object-cover border-4 border-brand-accent flex-shrink-0" />
        <div className="text-left flex-grow w-full">
          <h3 className="text-2xl font-bold text-brand-text">{tokenInfo.name} ({tokenInfo.symbol})</h3>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-xs font-mono text-brand-text-secondary">TOKEN ADDRESS</label>
              <div className="flex items-center gap-2">
                <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface/50 p-2 rounded-md flex-grow">{tokenInfo.address}</p>
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
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
                    </>
                  )}
                </button>
              </div>
            </div>
<<<<<<< HEAD

            {/* Transaction Signature */}
            {tokenInfo.signature && (
              <div className="mb-3">
                <label className="text-xs font-mono text-brand-text-secondary block mb-1">
                  TRANSACTION SIGNATURE
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-brand-text-secondary break-all font-mono text-xs bg-brand-surface/50 p-2 rounded-md flex-grow">
                    {tokenInfo.signature}
                  </p>
                  <button 
                    onClick={handleCopyTx} 
                    className="flex-shrink-0 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 bg-brand-accent hover:bg-brand-accent-hover text-white"
                  >
                    {copiedTx ? (
                      <CheckIcon className="h-4 w-4" />
                    ) : (
                      <CopyIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Owner Address */}
            <div>
              <label className="text-xs font-mono text-brand-text-secondary block mb-1">
                OWNER / AUTHORITY
              </label>
              <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface/50 p-2 rounded-md">
                {tokenInfo.ownerAddress}
              </p>
=======
            <div>
              <label className="text-xs font-mono text-brand-text-secondary">OWNER / AUTHORITY</label>
              <p className="text-brand-text-secondary break-all font-mono text-sm bg-brand-surface/50 p-2 rounded-md">{tokenInfo.ownerAddress}</p>
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Explorer Links */}
      <div className="bg-brand-bg/50 p-4 rounded-lg mb-6 border border-brand-border">
        <h3 className="font-semibold text-lg mb-3 text-brand-text">View on Explorer</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={getExplorerUrl(tokenInfo.address, 'address')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-brand-surface border border-brand-border rounded-lg hover:border-brand-accent transition-colors text-sm font-medium text-brand-text"
          >
            View Token on Solscan
            <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {tokenInfo.signature && (
            <a
              href={getExplorerUrl(tokenInfo.signature, 'tx')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-brand-surface border border-brand-border rounded-lg hover:border-brand-accent transition-colors text-sm font-medium text-brand-text"
            >
              View Transaction
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-brand-bg/50 p-6 rounded-lg text-left border border-brand-border mb-6">
        <h3 className="font-semibold text-xl mb-4 text-brand-accent">
          Next Steps: Launch on Raydium
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-brand-text-secondary">
          <li>
            Go to the{' '}
            <a 
              href="https://raydium.io/liquidity/create/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-accent-hover hover:underline"
            >
              Raydium Create Pool
            </a>
            {' '}page.
          </li>
=======
      <div className="bg-brand-bg/50 p-6 rounded-lg text-left border border-brand-border">
        <h3 className="font-semibold text-xl mb-4 text-brand-accent">Next Steps: Launch on Raydium</h3>
        <ol className="list-decimal list-inside space-y-2 text-brand-text-secondary">
          <li>Go to the <a href="https://raydium.io/liquidity/create/" target="_blank" rel="noopener noreferrer" className="text-brand-accent-hover hover:underline">Raydium Create Pool</a> page.</li>
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
          <li>Connect your wallet.</li>
          <li>Paste your new token address to set up the liquidity pool.</li>
          <li>Follow the instructions on Raydium to complete the launch.</li>
        </ol>
      </div>

<<<<<<< HEAD
      <button 
        onClick={onReset} 
        className="w-full py-3 px-4 border border-brand-accent rounded-lg shadow-sm text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent transition-colors duration-300"
      >
=======
      <button onClick={onReset} className="mt-8 w-full py-3 px-4 border border-brand-accent rounded-lg shadow-sm text-sm font-medium text-brand-accent hover:bg-brand-accent hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-accent transition-colors duration-300">
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
        Create Another Token
      </button>
    </div>
  );
};

<<<<<<< HEAD
export default TokenResult;
=======
export default TokenResult;
>>>>>>> 5a6c19771b2038fb048a22deec7da9933aaaf50f
