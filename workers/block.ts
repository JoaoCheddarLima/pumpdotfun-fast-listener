import 'dotenv/config';

import {
  parentPort,
  workerData,
} from 'worker_threads';

import { decodeTransactionInfo } from '../helpers/pumpfun/decoder';
import { Transaction } from '../types/rpc';

const { transactions, timestamp } = workerData
let decodedTransactions: any[] = []

let counter = 0
transactions.forEach(async (transaction: Transaction) => {
  const decoded = decodeTransactionInfo(transaction, timestamp)

  if (decoded) decodedTransactions.push(...decoded)

  counter++

  if (counter == transactions.length) {
    parentPort?.postMessage(Buffer.from(JSON.stringify(decodedTransactions), 'utf-8'));
  }
})