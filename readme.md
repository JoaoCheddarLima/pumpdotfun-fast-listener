# ⚡ Pumpdotfun fast listener

![pumpfun_fast_logo](./images/pump_fast.png)

## Overview

This project utilizes Node.js worker threads to optimize the processing of Solana blocks and improve overall efficiency. While GoLang would be the ideal choice due to Solana's high number of blocks per second, we have implemented worker threads in Node.js to achieve similar performance benefits. With an average processing time of 150 ms per block, this project aims to provide a solid solution for handling Solana transactions.

## Installation

To run this project, make sure you have a node version that supports **worker threads**. Follow these steps to get started:

1. Clone this repository.

2. Install the dependencies by running `yarn` or `npm i -g yarn; yarn`.

3. Replace the RPC urls in the [.env.example](.env.example) file with your own.

Now you have all the basics set up!

## Development

During the development of this project, we have provided some useful CLI commands that you can run using yarn:

- `yarn decode <PASTE_TX_HASH>`: This command decodes a transaction, prints it on the terminal, and saves the original transaction in the [local](./local) folder using the transaction hash as the file name.

- `yarn fetch <PASTE_TX_HASH>`: Instead of decoding, this command saves the transaction directly into the [local](./local) folder using the transaction hash as the file name.

- `yarn start`: This command compiles the code into regular JavaScript and runs it for performance upgrades without logging. You can add the `log` flag to check the speed.

- `yarn debug`: This command runs the script using TypeScript along with some flags for logging times and tracking the application's behavior.

- `yarn db`: This command runs your database connection. Make sure to start it after running `yarn start` or `yarn debug`, as it receives messages from the specific socket.

Those are the scripts under the hood
```json
{
    "debug": "tsc && tsx ./main.ts dev log",
    "start": "tsc && node ./dist/main.js",
    "db": "tsc && node ./dist/db/index.js",
    "fetch": "tsx ./helpers/writetx.ts",
    "decode": "tsx ./helpers/pumpfun/decoder.ts test save log"
}
```
## Getting Started

To get started with this project, you need to implement your database connection logic inside the [parser.ts](./connections/parser.ts) file or edit it as per your requirements. After establishing the connection, you can implement your data saving logic inside the [index.ts](./db/index.ts) file.

## Running

To run the project, follow these steps:

1. Run the `yarn start` script to start an instance of the decoder and parser.

2. Run the `yarn db` script to start the database listener and data saver. Separating the decoder and the database logic helps optimize the processing of Solana transactions, considering the volume of blocks and the number of transactions per second.


By running these scripts, you can efficiently handle Solana transactions by decoding them separately and saving the data in the database. This approach takes advantage of JavaScript's event loop and allows for better performance and scalability.


