import 'dotenv/config';

import axios from 'axios';
import bs58 from 'bs58';

import {
  r,
  save,
} from '../';
import { Transaction } from '../../types/rpc';
import {
  getAccountsForCreateInstructions,
  getAccountsFromInstructions,
  TransactionInstructionType,
} from './';
import { PUMPFUN_SWAP_DATA_STRUCT } from './struct';

const {
    PUMP_PROGRAM,
    PUMP_MINT,
    HTTP
} = process.env

const test = process.argv.includes("test")

function decodePump(data: string) {
    try {
        const bufferBS58 = bs58.decode(data)
        const decoded = PUMPFUN_SWAP_DATA_STRUCT.decode(bufferBS58)

        const newStruct = {
            sol_amount: r(decoded.sol_amount) / 10 ** 9,
            token_amount: r(decoded.token_amount) / 10 ** 6,
            is_buy: decoded.is_buy,
            virtual_token_reserves: r(decoded.virtual_token_reserves) / 10 ** 6,
            virtual_sol_reserves: r(decoded.virtual_sol_reserves) / 10 ** 9,
            user: decoded.user_publickey.toString(),
            timestamp: r(decoded.timestamp),
        }

        return newStruct
    } catch (err) {
        return null
    }
}

export function decodeTransactionInfo(tx: Transaction, timestamp: number) {
    if (tx.meta.err) {
        return null
    };
    const decodedTransactions: any[] = []

    const innerInstructionsMapped = new Map<number, any[]>()
    const innerInstructions = tx.meta.innerInstructions

    innerInstructions?.forEach(async (inner) => {
        innerInstructionsMapped.set(inner.index, inner.instructions)
    })

    tx.transaction.message.instructions.forEach(async (instruction, i) => {
        let creationIndex = false

        const innerInstructions = innerInstructionsMapped.get(i)

        if (instruction.programId == PUMP_PROGRAM && instruction?.accounts?.includes(PUMP_MINT!)) {
            creationIndex = true
            decodedTransactions.push({
                type: TransactionInstructionType.CREATED,
                hash: tx.transaction.signatures[0],
                accounts: getAccountsForCreateInstructions(instruction.accounts),
                index: i,
                timestamp
            })
        }

        if (innerInstructions && !creationIndex) {
            innerInstructions.forEach(async (innerInstruction: any, x) => {
                if (innerInstruction.programId == PUMP_PROGRAM) {
                    const decoded = decodePump(innerInstruction.data)

                    if (!decoded) return;

                    decodedTransactions.push({
                        ...decoded,
                        type: decoded.is_buy ? TransactionInstructionType.BUY : TransactionInstructionType.SELL,
                        accounts: getAccountsFromInstructions(instruction.accounts),
                        hash: tx.transaction.signatures[0],
                        index: Number(`${i}.${x}`)
                    })
                }
            })
        }

    })

    return decodedTransactions
}

if (test) {
    const txn = process.argv[process.argv.length - 1]
    axios.post(
        HTTP!,
        {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransaction",
            "params": [
                txn,
                {
                    "encoding": "jsonParsed",
                    "commitment": "confirmed",
                    "maxSupportedTransactionVersion": 0
                }
            ]
        }
    ).then(({ data }) => {
        save(data, txn)

        const instruction = decodeTransactionInfo(data.result, 0)
        console.log(instruction)
    })
}