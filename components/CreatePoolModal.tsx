import React, { useState, useMemo } from 'react';
import type { CreatedTokenInfo } from '../types';
import { CloseIcon } from './icons/CloseIcon';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tokenInfo: CreatedTokenInfo;
  onCreatePool: (solAmount: number, tokenAmount: number) => Promise<void>;
}

const CreatePoolModal: React.FC<CreatePoolModalProps> = ({
  isOpen,
  onClose,
  tokenInfo,
  onCreatePool
}) => {
  const [solAmount, setSolAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const isFormValid = useMemo(() => {
    const sol = parseFloat(solAmount);
    const token = parseFloat(tokenAmount);
    return sol > 0 && token > 0 && !isNaN(sol) && !isNaN(token);
  }, [solAmount, tokenAmount]);

  const estimatedPrice = useMemo(() => {
    const sol = parseFloat(solAmount);
    const token = parseFloat(tokenAmount);
    if (sol > 0 && token > 0) {
      return (sol / token).toFixed(9);
    }
    return '0';
  }, [solAmount, tokenAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsCreating(true);
    setError('');

    try {
      await onCreatePool(parseFloat(solAmount), parseFloat(tokenAmount));
      onClose();
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'Failed to create liquidity pool');
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center animate-fade-in p-4">
      <div className="bg-brand-surface rounded-2xl shadow-2xl p-8 m-4 w-full max-w-lg relative border border-brand-accent/50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-brand-text-secondary hover:text-brand-text"
          disabled={isCreating}
        >
          <CloseIcon className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold mb-4 text-brand-text">Create Liquidity Pool</h2>
        <p className="text-brand-text-secondary mb-6">
          Add liquidity to create a trading pool for {tokenInfo.symbol}/SOL on Raydium.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">
              SOL Amount
            </label>
            <input
              type="number"
              value={solAmount}
              onChange={(e) => setSolAmount(e.target.value)}
              placeholder="0.0"
              step="0.000000001"
              min="0"
              disabled={isCreating}
              className="w-full bg-brand-bg-transparent border border-brand-border rounded-lg p-3 text-brand-text focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition duration-200"
            />
            <p className="text-xs text-brand-text-secondary mt-1">
              Recommended: At least 1 SOL for better liquidity
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-secondary mb-2">
              {tokenInfo.symbol} Amount
            </label>
            <input
              type="number"
              value={tokenAmount}
              onChange={(e) => setTokenAmount(e.target.value)}
              placeholder="0.0"
              step="0.000000001"
              min="0"
              disabled={isCreating}
              className="w-full bg-brand-bg-transparent border border-brand-border rounded-lg p-3 text-brand-text focus:ring-2 focus:ring-brand-accent focus:border-brand-accent outline-none transition duration-200"
            />
            <p className="text-xs text-brand-text-secondary mt-1">
              Amount of {tokenInfo.symbol} tokens to add to the pool
            </p>
          </div>

          {isFormValid && (
            <div className="bg-brand-bg-transparent p-4 rounded-lg border border-brand-border">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-brand-text-secondary">Initial Price:</span>
                <span className="text-sm font-mono text-brand-text">{estimatedPrice} SOL per {tokenInfo.symbol}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-text-secondary">Pool Ratio:</span>
                <span className="text-sm font-mono text-brand-text">1 {tokenInfo.symbol} = {estimatedPrice} SOL</span>
              </div>
            </div>
          )}

          <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 text-sm text-yellow-300">
            <p className="font-semibold mb-2">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Creating a pool requires creating an OpenBook market first</li>
              <li>This process involves multiple transactions</li>
              <li>Pool creation may take 1-2 minutes to complete</li>
              <li>Ensure you have enough SOL for transaction fees (~0.5 SOL)</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 rounded-lg p-4 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="flex-1 py-3 px-4 border border-brand-border rounded-lg text-sm font-medium text-brand-text-secondary hover:border-brand-accent transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isCreating}
              className="flex-1 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-accent hover:bg-brand-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Pool...
                </>
              ) : (
                'Create Pool'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoolModal;
