import 'dotenv/config';

import { Worker } from 'worker_threads';
import ws from 'ws';

import { startWss } from './connections/rpc';
import { log } from './helpers';
import { BlockNotification } from './types/rpc';

const server = new ws.Server({
    port: 5715
})

export async function processBlockData(block_data: BlockNotification) {
    const transactions = block_data.params.result.value.block.transactions;
    log(`[<] Creating worker for ${block_data.params.result.context.slot}`);
    const nowStart = Date.now()
    const worker = new Worker('./dist/workers/block.js', { workerData: { transactions, timestamp: block_data.params.result.value.block.blockTime } });

    worker.once('message', (msg) => {
        worker.terminate();
        log(`[<] Worker for ${block_data.params.result.context.slot} finished in ${(Date.now() - nowStart) / 1000}s`);

        server.clients.forEach(client => {
            client.send(msg);
        });

        log(`[<] Worker for ${block_data.params.result.context.slot} finished in ${(Date.now() - nowStart) / 1000}s`);
    });
}

startWss(processBlockData)