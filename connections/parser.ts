import Websocket from 'ws';

const {
    PARSER_PORT
} = process.env

let socket: Websocket | null = null

async function connectToMyDatabase() {
    try {
        //DB connection logic

        return true
    } catch (err) {
        console.error(err)
        return false
    }
}

export async function startWss(processBlockData: (transactions: any) => void) {
    let processStarted = false
    let cacheQueue: any[] = []
    let connectedToDB = false

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

    socket = new Websocket('ws://localhost:' + PARSER_PORT)

    socket.on("close", (m) => {
        console.log(`[<>] Disconnected from WSS`)
        startWss(processBlockData)
    })

    socket.on("open", async () => {
        console.log(`[<>] Connected to WSS`)

        await connectToMyDatabase()
            .then((connected) => {
                console.log("[<>] Connected to Database")
                connectedToDB = connected
            })
            .catch(() => {
                console.log("[X] Failed to connect to Database")
                connectedToDB = false
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

        //creates a cache for saving if trouble on db connection
        if (connectedToDB) {
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