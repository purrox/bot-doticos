import {Schema, model, Model} from 'mongoose';

export interface IUser {
    username: string,
    mmr: number, //Dota MMR
    internalMMR?: number,
    discord: string,
    _id?: string,
    win?: number,
    lose?: number
}

let userSchema:  Schema<IUser> = new Schema<IUser>({
    username: {type: String, required: true},
    mmr: {type: Number, required: true},
    internalMMR: {type:Number, required:true, default:1000},
    discord: {type: String, required: true, unique:true},
    win: {type: Number, required: false, default: 0},
    lose: {type: Number, required: false, default: 0},
});
export const UserModel: Model<IUser> = model<IUser>('User', userSchema);