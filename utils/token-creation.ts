import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddress,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
  AuthorityType,
} from '@solana/spl-token';
import { connection, TOKEN_DEFAULTS } from '../lib/solana-config';

export interface CreateTokenParams {
  name: string;
  symbol: string;
  metadataUri: string;
  payer: PublicKey;
  decimals?: number;
  supply?: number;
}

export interface CreateTokenResult {
  signature: string;
  mintAddress: string;
  metadataUri: string;
}

/**
 * Create SPL Token with metadata
 */
export async function createToken(
  params: CreateTokenParams,
  signTransaction: (transaction: Transaction) => Promise<Transaction>
): Promise<CreateTokenResult> {
  const {
    payer,
    metadataUri,
    decimals = TOKEN_DEFAULTS.decimals,
    supply = TOKEN_DEFAULTS.supply,
  } = params;

  try {
    // Generate new mint keypair
    const mintKeypair = Keypair.generate();
    const mintPublicKey = mintKeypair.publicKey;

    console.log('Creating token mint:', mintPublicKey.toBase58());

    // Get rent exemption amount
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    // Get associated token account address
    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      payer,
      false,
      TOKEN_PROGRAM_ID
    );

    // Create transaction
    const transaction = new Transaction();

    // Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mintPublicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      })
    );

    // Initialize mint
    transaction.add(
      createInitializeMintInstruction(
        mintPublicKey,
        decimals,
        payer, // mint authority
        payer, // freeze authority
        TOKEN_PROGRAM_ID
      )
    );

    // Create associated token account
    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer, // payer
        associatedTokenAccount, // associated token account
        payer, // owner
        mintPublicKey, // mint
        TOKEN_PROGRAM_ID
      )
    );

    // Mint initial supply
    const mintAmount = BigInt(supply) * BigInt(10 ** decimals);
    transaction.add(
      createMintToInstruction(
        mintPublicKey,
        associatedTokenAccount,
        payer,
        mintAmount,
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Revoke mint authority (make supply fixed)
    transaction.add(
      createSetAuthorityInstruction(
        mintPublicKey,
        payer,
        AuthorityType.MintTokens,
        null, // Set to null to revoke
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Revoke freeze authority (make token unfrozen)
    transaction.add(
      createSetAuthorityInstruction(
        mintPublicKey,
        payer,
        AuthorityType.FreezeAccount,
        null, // Set to null to revoke
        [],
        TOKEN_PROGRAM_ID
      )
    );

    // Get recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
    transaction.feePayer = payer;

    // Partially sign with mint keypair
    transaction.partialSign(mintKeypair);

    // Sign with wallet
    const signedTransaction = await signTransaction(transaction);

    // Send and confirm transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    console.log('Transaction sent:', signature);

    // Wait for confirmation
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');

    console.log('Token created successfully!');

    return {
      signature,
      mintAddress: mintPublicKey.toBase58(),
      metadataUri,
    };
  } catch (error) {
    console.error('Error creating token:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to create token: ${error.message}`);
    }
    throw new Error('Failed to create token. Please try again.');
  }
}

/**
 * Get token balance
 */
export async function getTokenBalance(
  mintAddress: string,
  ownerAddress: string
): Promise<number> {
  try {
    const mintPublicKey = new PublicKey(mintAddress);
    const ownerPublicKey = new PublicKey(ownerAddress);

    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      ownerPublicKey,
      false,
      TOKEN_PROGRAM_ID
    );

    const balance = await connection.getTokenAccountBalance(associatedTokenAccount);
    return parseFloat(balance.value.uiAmount?.toString() || '0');
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
}
