export enum TransactionInstructionType {
    CREATED = "created",
    SELL = "sell",
    BUY = "buy",
    UPDATED_ACCOUNT_BALANCE = "updated_account_balance"
}

export interface TransactionInstructionCreatedEvent {
    type: TransactionInstructionType.CREATED,
    timestamp: number,
    token_publickey?: string,
    user_publickey?: string
}

export interface TransactionInstructionUpdatedAccountBalanceEvent {
    type: TransactionInstructionType.UPDATED_ACCOUNT_BALANCE,
    user?: string,
    new_balance: number
}

export interface TransactionInstructionSwapEvent {
    type: TransactionInstructionType.BUY | TransactionInstructionType.SELL,
    sol_amount: BigInt,
    token_amount: BigInt,
    token_publickey?: string,
    timestamp: BigInt,
    user_publickey: string,
    virtual_sol_reserves: BigInt,
    virtual_token_reserves: BigInt,
}

export type TransactionInstruction = (TransactionInstructionCreatedEvent | TransactionInstructionSwapEvent) & {
    accounts: any
};

export const getAccountsFromInstructions =(accounts: string[] = []) => ({
    global: accounts?.[0],
    fee: accounts?.[1],
    mint: accounts?.[2],
    bonding_curve: accounts?.[3],
    associated_bonding_curve: accounts?.[4],
    associated_user: accounts?.[5],
    user: accounts?.[6]
})

export const getAccountsForCreateInstructions =(accounts: string[] = []) => ({
    mint: accounts?.[0],
    bonding_curve: accounts?.[2],
    associated_bonding_curve: accounts?.[3],
    global: accounts?.[4],
    user: accounts?.[7]
})