import "reflect-metadata";

import {inject, injectable} from 'inversify';
import {IGame, GameSchema, GameStatus, Faction} from './schemas/Games'
import {HydratedDocument, model, Document, Types} from "mongoose";
import logger from '../config/LoggersConfiguration'
import {IUser} from "./schemas/Users";
import {generateSlug} from "random-word-slugs";
import RedisConfiguration from "../config/RedisConfiguration";
import ObjectId = Types.ObjectId

const PREFIX_NAME: string = 'Dotico';

@injectable()
export class GamesServices {

    private redisConfiguration: RedisConfiguration;
    private redisClient: any;

    constructor(@inject(RedisConfiguration) redisConfiguration: RedisConfiguration) {
        this.redisConfiguration = redisConfiguration;
        this.redisClient = this.redisConfiguration.client;
    }

    public async createGame(user: IUser | null): Promise<IGame | null> {

        if (user === null) {
            return null
        }
        console.log(user._id)
        const existGame: IGame | null = await this.findGameActiveByUser(user._id as string)
        console.log(existGame)
        if (existGame != null) {
            return null;
        }

        // console.log(await this.redisConfiguration.client.lRange('work:queue:ids', 0, -1))

        const teams: Map<Faction, IUser[]> = new Map<Faction, IUser[]>;

        teams.set('Radiant', [user]);
        teams.set('Dire', []);

        const game: IGame = {
            createdBy: user,
            name: `${PREFIX_NAME}-${generateSlug(1, {format: "title", categories: {noun: ['people', 'animals']}})}`,
            status: 'Active',
            team: teams
        }
        const gameSchema: HydratedDocument<IGame> = new GameSchema(game);

        return await gameSchema.save();
    }

    public async addUserToGame(gameId: string | undefined, player: string | undefined): Promise<number> {

        let id: string;
        try {
            // @ts-ignore
            id = gameId.toHexString();
        } catch (e) {
            id = gameId as string;
        }

        const username: string = player as string;

        console.log(id, username)

        // @ts-ignore
        return await this.redisClient.RPUSH(id, username);
    }

    public async findGameActiveByUser(id: string): Promise<IGame | null> {
        return model<IGame | null>('Game').findOne({createdBy: new ObjectId(id), status: 'Active'})
    }

}