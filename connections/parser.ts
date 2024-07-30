import { connect } from 'mongoose';
import Websocket from 'ws';

const {
    PARSER_PORT,
    MONGO_URI
} = process.env

let socket: Websocket | null = null

export async function startWss(processBlockData: (transactions: any) => void) {
    let processStarted = false
    let cacheQueue: any[] = []
    let connectedToMongoose = false

    if (socket !== null) {
        socket.close()
        socket = null
    }

    setTimeout(() => {
        if (!processStarted && socket?.readyState == 1) {
            console.log("[X] WSS connection failed, restarting")
            socket?.close()
        }
    }, 1000)

    socket = new Websocket('ws://sol_listener:' + PARSER_PORT)

    socket.on("close", (m) => {
        console.log(`[<>] Disconnected from WSS`)
        startWss(processBlockData)
    })

    socket.on("open", async () => {
        console.log(`[<>] Connected to WSS`)

        connect(MONGO_URI!, {
            autoIndex: true
        })
            .then(r => {
                connectedToMongoose = true
            })

        setInterval(() => {
            if (socket?.readyState == 1) {
                socket!.ping()
            }
        }, 5000)
    })

    socket.on("message", async (msg: Buffer) => {
        const data: any = JSON.parse(Buffer.from(msg).toString('utf-8'))

        processStarted = true

        if (connectedToMongoose) {
            if (cacheQueue.length > 0) {
                cacheQueue.forEach(
                    async (cache) => {
                        processBlockData(cache)
                    }
                )

                cacheQueue = []
            }
            processBlockData(data)
        } else {
            cacheQueue.push(data)
        }
    })
}