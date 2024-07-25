import 'dotenv/config';

import { startWss } from '../connections/parser';
import { TransactionInstructionType } from '../helpers/pumpfun';
import { DecodedTransactionData } from '../types/rpc';

async function processTransactions(transactions: DecodedTransactionData[]) {
    const sortedTxns = transactions.sort((a, b) => a.index - b.index)

    sortedTxns.forEach(async (transaction) => {
        if (transaction.type == TransactionInstructionType.CREATED) {
            //db logic here
        }

        if (transaction.type == TransactionInstructionType.BUY || transaction.type == TransactionInstructionType.SELL) {
            //db logic here
        }
    })
}

startWss(processTransactions)