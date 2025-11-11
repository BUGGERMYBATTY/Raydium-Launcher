import { useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect, useState } from 'react';

export function useWalletConnection() {
  const { publicKey, connected, disconnect, connecting, wallet } = useWallet();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
    } else {
      setWalletAddress(null);
    }
  }, [connected, publicKey]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
      setWalletAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [disconnect]);

  return {
    walletAddress,
    connected,
    connecting,
    wallet,
    publicKey,
    disconnect: handleDisconnect,
  };
}
