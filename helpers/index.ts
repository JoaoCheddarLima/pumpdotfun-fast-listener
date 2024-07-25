import {
  appendFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from 'fs';

export function r(n: BigInt): number {
    return Number(String(n).replace('n', ''))
}

function timestamp(text: string) {
    let now = new Date()
    const mins = now.getMinutes().toString().length == 1 ? `0${now.getMinutes()}` : now.getMinutes()
    const secs = now.getSeconds().toString().length == 1 ? `0${now.getSeconds()}` : now.getSeconds()
    const millis = now.getMilliseconds().toString().padStart(3, '0');

    return `[${now.getHours()}:${mins}:${secs}:${millis}] ${text}\n`
}

export class Log {
    private innerText: string[] = []

    public addInnerText(text: string) {
        this.innerText.push(timestamp(text))
    }

    public writeMany() {
        let unique = ''

        this.innerText.forEach(e => {
            unique += e
        })

        process.stdout.write(unique)
    }

    static write(text: string) {
        process.stdout.write(timestamp(text))
    }

    static skipLine() {
        process.stdout.write('\n')
    }

    static clear() {
        process.stdout.write('\x1Bc');
    }
}

export class Local {
    static saveData(data: any, label: string) {
        if (!existsSync('./local')) {
            mkdirSync('./local');
        }
        writeFileSync(`./local/${label}.json`, JSON.stringify(data, null, 4))
    }

    static appendData(data: any, label: string) {
        if (!existsSync('./local')) {
            mkdirSync('./local');
        }

        appendFileSync(`./local/${label}.logs`, data + '\n')
    }
}

const args = process.argv.slice(2)

const logMode = args.includes('log') || false
const saveMode = args.includes('save') || false

export function log(text: string) {
    if (logMode) Log.write(text)
}

export function save(data: any, label: string) {
    if (saveMode) {
        Log.write(`[>] Saving data to ${label}.json`)
        Local.saveData(data, label)
    }
}

export function append(text: string, label: string) {
    Log.write(`[>] Appending data to ${text}.logs`)
    Local.appendData(text, label)
}