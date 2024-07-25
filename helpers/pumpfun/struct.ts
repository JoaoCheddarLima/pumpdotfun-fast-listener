import { struct } from '@solana/buffer-layout';
import {
  bool,
  publicKey,
  u64,
} from '@solana/buffer-layout-utils';

interface PumpFunSwapDataStruct {
    sol_amount: BigInt,
    token_amount: BigInt,
    is_buy: boolean,
    user_publickey: any,
    timestamp: BigInt,
    virtual_sol_reserves: BigInt,
    virtual_token_reserves: BigInt,
}

export const PUMPFUN_SWAP_DATA_STRUCT = struct<PumpFunSwapDataStruct>([
    u64("_"),
    u64("_"),
    u64("_"),
    u64("_"),
    u64("_"),
    u64("_"),
    u64("sol_amount"),
    u64("token_amount"),
    bool("is_buy"),
    publicKey("user_publickey"),
    u64("timestamp"),
    u64("virtual_sol_reserves"),
    u64("virtual_token_reserves"),
]);

interface PumpFunCreateDataStruct {
    sol_amount: BigInt,
    token_amount: BigInt,
    is_buy: boolean,
    user_publickey: any,
    timestamp: BigInt,
    virtual_sol_reserves: BigInt,
    virtual_token_reserves: BigInt,
}

export const PUMPFUN_CREATE_DATA_STRUCT = struct<PumpFunCreateDataStruct>([
    u64("_"),
    u64("_"),
    u64("_"),
    u64("_"),
    u64("_"),
    u64("_"),
    u64("sol_amount"),
    u64("token_amount"),
    bool("is_buy"),
    publicKey("user_publickey"),
    u64("timestamp"),
    u64("virtual_sol_reserves"),
    u64("virtual_token_reserves"),
]);