import 'dotenv/config';

import axios from 'axios';

import { save } from './';

const { HTTP } = process.env

axios.post(
    HTTP!,
    {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTransaction",
        "params": [
            process.argv[2],
            {
                "encoding": "jsonParsed",
                "commitment": "confirmed",
                "maxSupportedTransactionVersion": 0
            }
        ]
    }
).then(({ data }) => {
    save(data, process.argv[2])
})