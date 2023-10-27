import {Schema, model, Model} from 'mongoose';
import {IUser, UserModel} from "./Users";
import {User} from "discord.js";

export type Faction = 'Radiant' | 'Dire';

export type GameStatus = 'Active' | 'Destroyed' | 'Finished' | 'In process';

export interface IGame {
    createAt?: Date,
    duration?: number, // minutes
    name: string,
    server?: string,
    createdBy: IUser,
    team: Map<Faction, IUser[]>,
    status: GameStatus,
    _id?: string,
}

let gameSchema: Schema<IGame> = new Schema<IGame>({
    createAt: {type: Date, default: Date.now},
    duration: {type: Number, default: 0},
    name: {type: String, required: false},
    server: {type: String, required: false},
    createdBy: {type: Schema.Types.ObjectId, ref:'User', required: true},
    team: {type: Map, required: true},
    status: {type: String, required:true}
})

export const GameSchema: Model<IGame> = model<IGame>('Game', gameSchema)