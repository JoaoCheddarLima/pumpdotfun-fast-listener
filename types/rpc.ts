import { TransactionInstructionType } from '../helpers/pumpfun';

export interface instructions {
    accounts?: string[];
    data: string;
    programId: string;
    program?: string;
    parsed?: {
        info?: any;
        type: string;
    };
    stackHeight: null;
}

export interface parsedTokenBalances {
    accountIndex: number;
    mint: string;
    uiTokenAmount: {
        uiAmount: number;
        decimals: number;
        amount: string;
        uiAmountString: string;
    };
    owner: string;
    programId: string;
}

export interface Transaction {
    transaction: {
        "signatures": string[];
        message: {
            accountKeys: {
                pubkey: string;
                signer: boolean;
                writable: boolean;
            }[];
            instructions: instructions[];
            addressTableLookups: any[];
        };
    };
    meta: {
        err: null;
        status: {
            Ok: null;
        };
        fee: number;
        preBalances: number[];
        postBalances: number[];
        innerInstructions?: {
            instructions: instructions[];
            index: number;
        }[];
        logMessages: string[];
        preTokenBalances: parsedTokenBalances[];
        postTokenBalances: parsedTokenBalances[];
        rewards: null;
        computeUnitsConsumed: number;
    };
    version: number;
}

export interface Block {
    transactions: Transaction[];
    blockTime: number;
    blockHeight: number;
    parentSlot: number;
    previousBlockHash: string;
    blockhash: string;
}

export interface BlockNotification {
    jsonrpc: string;
    method: string;
    params: {
        result: {
            context: {
                slot: number;
            };
            value: {
                slot: number;
                err: null;
                block: Block;
            };
        };
        subscription: number;
    };
}

export interface DecodedTransactionData {
    type: TransactionInstructionType;
    hash: string;
    accounts: {
        mint: string;
        global: string;
        bonding_curve: string;
        associated_bonding_curve: string;
        user: string;
    };
    sol_amount?: number;
    token_amount?: number;
    is_buy?: boolean;
    virtual_token_reserves?: number;
    virtual_sol_reserves?: number;
    new_balance: number;
    user?: string;
    timestamp: number;
    index: number;
}