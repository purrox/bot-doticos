import pino from "pino";

const logger: any = pino({
    level: 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true
        }
    }
})

export default logger;