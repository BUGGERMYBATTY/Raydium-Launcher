import { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount
} from '@solana/spl-token';
import {
  Raydium,
  TxVersion,
  parseTokenAccountResp,
} from '@raydium-io/raydium-sdk-v2';
import { Buffer } from 'buffer';
import BN from 'bn.js';

// Devnet program IDs for Raydium
const DEVNET_PROGRAM_ID = {
  SERUM_PROGRAM_ID_V3: new PublicKey('DESVgJVGajEgKGXhb6XmqDHGz3VjdgP7rEVESBgxmroY'),
  OPENBOOK_MARKET: new PublicKey('EoTcMgcDRTJVZDMZWBoU6rhYHZfkNTVEAfz3uUJRcYGj'),
  RAYDIUM_AMM: new PublicKey('HWy1jotHpo6UqeQxx49dpYYdQB8wj9Qk9MdxwjLvDHB8'),
  CPMM_PROGRAM: new PublicKey('CPMDWBwJDtYax9qW7AyRuVC19Cc4L4Vcy3n2mjjtifMH'),
};

const NATIVE_SOL = {
  mint: new PublicKey('So11111111111111111111111111111111111111112'),
  decimals: 9,
};

/**
 * Create an OpenBook market for the token pair
 */
export async function createMarket(
  connection: Connection,
  wallet: WalletContextState,
  baseMint: PublicKey,
  quoteMint: PublicKey = NATIVE_SOL.mint
): Promise<PublicKey> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Initialize Raydium SDK
    const raydium = await Raydium.load({
      owner: wallet.publicKey,
      connection,
      cluster: 'devnet',
      disableFeatureCheck: true,
      disableLoadToken: false,
    });

    // Get token info
    const baseToken = await raydium.token.getTokenInfo(baseMint.toBase58());
    const quoteToken = await raydium.token.getTokenInfo(quoteMint.toBase58());

    if (!baseToken || !quoteToken) {
      throw new Error('Failed to fetch token information');
    }

    // Create market with Raydium SDK V2
    const { execute, extInfo } = await raydium.marketV2.create({
      baseInfo: {
        mint: baseMint,
        decimals: baseToken.decimals,
      },
      quoteInfo: {
        mint: quoteMint,
        decimals: quoteToken.decimals,
      },
      lotSize: 1,
      tickSize: 0.01,
      dexProgramId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET,
      requestQueue: Keypair.generate(),
      eventQueue: Keypair.generate(),
      bids: Keypair.generate(),
      asks: Keypair.generate(),
      baseVault: Keypair.generate(),
      quoteVault: Keypair.generate(),
      feeRateBps: 0,
      quoteDustThreshold: 100,
      txVersion: TxVersion.V0,
    });

    // Execute the transaction
    const { txId } = await execute({ sendAndConfirm: true });

    console.log('Market created with signature:', txId);

    // Get the market ID from extInfo
    const marketId = extInfo.address.marketId;

    return new PublicKey(marketId);
  } catch (error) {
    console.error('Error creating market:', error);
    throw new Error(`Failed to create OpenBook market: ${(error as Error).message}`);
  }
}

/**
 * Create a CPMM liquidity pool on Raydium
 */
export async function createCpmmPool(
  connection: Connection,
  wallet: WalletContextState,
  tokenMint: PublicKey,
  tokenAmount: number,
  solAmount: number,
  tokenDecimals: number = 9
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Initialize Raydium SDK
    const raydium = await Raydium.load({
      owner: wallet.publicKey,
      connection,
      cluster: 'devnet',
      disableFeatureCheck: true,
      disableLoadToken: false,
    });

    // Get token info
    const mintA = await raydium.token.getTokenInfo(tokenMint.toBase58());
    const mintB = await raydium.token.getTokenInfo(NATIVE_SOL.mint.toBase58());

    if (!mintA || !mintB) {
      throw new Error('Failed to fetch token information');
    }

    // Get CPMM config (use default devnet config)
    const feeConfig = {
      id: new PublicKey('9zSzfkYy6awexsHvmggeH36pfVUdDGyCcwmjT3AQPBj6'),
      index: 0,
      protocolFeeRate: 25000,
      tradeFeeRate: 25,
      fundFeeRate: 40000,
      createPoolFee: new BN('0'),
    };

    // Create the pool
    const { execute, extInfo } = await raydium.cpmm.createPool({
      programId: DEVNET_PROGRAM_ID.CPMM_PROGRAM,
      poolFeeAccount: new PublicKey('3XMrhbv989VxAMi3DErLV9eJht1pHppW5LbKxe9fkEFR'),
      mintA,
      mintB,
      mintAAmount: new BN(tokenAmount * Math.pow(10, tokenDecimals)),
      mintBAmount: new BN(solAmount * LAMPORTS_PER_SOL),
      startTime: new BN(Math.floor(Date.now() / 1000)),
      feeConfig,
      associatedOnly: false,
      txVersion: TxVersion.V0,
    });

    // Execute the transaction
    const { txId } = await execute({ sendAndConfirm: true });

    console.log('CPMM Pool created with signature:', txId);
    console.log('Pool ID:', extInfo.address.poolId);

    return txId;
  } catch (error) {
    console.error('Error creating CPMM pool:', error);
    throw new Error(`Failed to create CPMM pool: ${(error as Error).message}`);
  }
}

/**
 * Create an AMM V4 liquidity pool on Raydium (requires OpenBook market)
 */
export async function createAmmPool(
  connection: Connection,
  wallet: WalletContextState,
  marketId: PublicKey,
  tokenMint: PublicKey,
  baseMintAmount: number,
  quoteMintAmount: number,
  tokenDecimals: number = 9
): Promise<string> {
  if (!wallet.publicKey || !wallet.signTransaction) {
    throw new Error('Wallet not connected');
  }

  try {
    // Initialize Raydium SDK
    const raydium = await Raydium.load({
      owner: wallet.publicKey,
      connection,
      cluster: 'devnet',
      disableFeatureCheck: true,
      disableLoadToken: false,
    });

    // Get token info
    const baseToken = await raydium.token.getTokenInfo(tokenMint.toBase58());
    const quoteToken = await raydium.token.getTokenInfo(NATIVE_SOL.mint.toBase58());

    if (!baseToken || !quoteToken) {
      throw new Error('Failed to fetch token information');
    }

    // Create AMM pool
    const { execute, extInfo } = await raydium.amm.createPool({
      programId: DEVNET_PROGRAM_ID.RAYDIUM_AMM,
      marketInfo: {
        marketId,
        programId: DEVNET_PROGRAM_ID.OPENBOOK_MARKET,
      },
      baseMintInfo: {
        mint: tokenMint,
        decimals: tokenDecimals,
      },
      quoteMintInfo: {
        mint: NATIVE_SOL.mint,
        decimals: NATIVE_SOL.decimals,
      },
      baseAmount: new BN(baseMintAmount * Math.pow(10, tokenDecimals)),
      quoteAmount: new BN(quoteMintAmount * LAMPORTS_PER_SOL),
      startTime: new BN(Math.floor(Date.now() / 1000)),
      txVersion: TxVersion.V0,
    });

    // Execute the transaction
    const { txId } = await execute({ sendAndConfirm: true });

    console.log('AMM Pool created with signature:', txId);
    console.log('Pool ID:', extInfo.address.ammId);

    return txId;
  } catch (error) {
    console.error('Error creating AMM pool:', error);
    throw new Error(`Failed to create AMM pool: ${(error as Error).message}`);
  }
}

/**
 * Main function to create a liquidity pool
 * This will use CPMM pool creation as it's simpler and doesn't require an OpenBook market
 */
export async function createLiquidityPool(
  connection: Connection,
  wallet: WalletContextState,
  tokenMint: string,
  solAmount: number,
  tokenAmount: number,
  tokenDecimals: number = 9
): Promise<{ signature: string; poolId?: string }> {
  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  const tokenMintPubkey = new PublicKey(tokenMint);

  try {
    // Use CPMM pool creation (simpler, no market required)
    const signature = await createCpmmPool(
      connection,
      wallet,
      tokenMintPubkey,
      tokenAmount,
      solAmount,
      tokenDecimals
    );

    return { signature };
  } catch (error) {
    console.error('Error in createLiquidityPool:', error);
    throw error;
  }
}
