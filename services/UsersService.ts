import "reflect-metadata";

import {injectable} from 'inversify';
import {IUser, UserModel} from './schemas/Users'
import {HydratedDocument, model, Document} from "mongoose";
import logger from '../config/LoggersConfiguration'


@injectable()
export class UsersService { //This should be a repository and create a real UserService?
    public async createUser(userData?: IUser): Promise<IUser> {
        try {
            const user: HydratedDocument<IUser> = new UserModel(userData);
            return await user.save();
        } catch (e) {
            logger.error('Error creating user:', e)
            throw new Error('Failed to save user');
        }
    }

    public async findUser(username: string): Promise<IUser | null>{
        try {
            return await model<IUser | null>('User').findOne({discord: username});
        }catch (e) {
            logger.error('Error finding user:', e)
            throw new Error('Failed to find user');
        }
    }

    public async userLeaderBoard(): Promise<IUser[] | []> {
        try {
            const users = await UserModel.find({}).sort({ internalMMR: -1 }).limit(15).exec();
            return users as IUser[];
        } catch (e) {
            logger.error('Error finding user:', e);
            throw new Error('Failed to find user');
        }
    }

}

