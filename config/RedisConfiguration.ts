import "reflect-metadata";
import {createClient} from "redis";
import {injectable} from 'inversify';
import logger from "../config/LoggersConfiguration";

@injectable()
class RedisConfiguration {
    public client: any

    constructor() {
        logger.info('Connecting to Redis...');
        this.client = createClient();
        this.client.on('error', (err: any | Error) => logger.error('Redis Client Error', err));
        this.client.connect();

        this.client.on("ready", () => {
            logger.info("Redis Connected successfully");
        });
    }

    public async disconnect(): Promise<void> {
        await this.client.disconnect()
        console.log('Redis Disconnected')
    }
}

export default RedisConfiguration;