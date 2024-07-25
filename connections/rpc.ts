import Websocket from 'ws';

import {
  log,
  save,
} from '../helpers';
import { BlockNotification } from '../types/rpc';

const {
    WSS,
    PUMP_PROGRAM
} = process.env

let socket: Websocket | null = null

export async function startWss(processBlockData: (block_data: BlockNotification) => void){
    let processStarted = false
    let cacheQueue: BlockNotification[] = []

    if (socket !== null) {
        socket.close()
        socket = null
    }

    setTimeout(() => {
        if (!processStarted && socket?.readyState == 1) {
            console.log("[X] WSS connection failed, restarting")
            socket?.close()
        }
    }, 5000)

    socket = new Websocket(WSS!)

    socket.on("close", (m) => {
        console.log(`[<>] Disconnected from WSS`)
        console.log(m)
        startWss(processBlockData)
    })

    socket.on("open", async () => {
        console.log(`[<>] Connected to WSS`)

        setInterval(() => {
            if (socket?.readyState == 1) {
                socket!.ping()
            }
        }, 5000)

        socket!.send(
            JSON.stringify(
                {
                    "jsonrpc": "2.0",
                    "id": "1",
                    "method": "blockSubscribe",
                    "params": [
                        {
                            "mentionsAccountOrProgram": PUMP_PROGRAM!
                        },
                        {
                            "commitment": "confirmed",
                            "encoding": "jsonParsed",
                            "showRewards": false,
                            "transactionDetails": "full",
                            "maxSupportedTransactionVersion": 0
                        }
                    ]
                }
            )
        )
    })

    socket.on("message", async (msg) => {
        log("[<] Received message")

        const data: BlockNotification = JSON.parse(msg.toString())

        save(data, 'BlockNotification')

        const blockData = data?.params?.result?.value?.block

        if (!processStarted) processStarted = true

        if (blockData) {

            log('[<] Block data received: ' + data.params.result.context.slot)
            save(blockData, 'Block')

            if (cacheQueue.length > 0) {
                console.log(`Processing ${cacheQueue.length} cached blocks`)
                for (let cache of cacheQueue) {
                    processBlockData(cache)
                }
                cacheQueue = []
            }

            processBlockData(data)
        } else {
            log('[<] Not block data ' + JSON.stringify(data))
        }
    })
}