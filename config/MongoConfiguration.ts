import "reflect-metadata";
const path=require("path")
require('dotenv').config({path: path.resolve(__dirname, "../.env")})
import mongoose from 'mongoose';
import { injectable } from 'inversify';
import logger from "../config/LoggersConfiguration";

@injectable()
export class MongoConfiguration {
    constructor() {}
    public async connect(): Promise<void> {
        try {
            logger.info('Connecting MongoDB...');
            await mongoose.connect(`mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_COLLECTION}`);
            logger.info('MongoDB connected successfully');
        } catch (error) {
            logger.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    public async disconnect(): Promise<void> {
        await mongoose.disconnect();
        logger.info('MongoDB disconnected');
    }

}
