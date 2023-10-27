import {REST, Routes } from "discord.js";
import * as commandsJSON from './commands.json'
const path=require("path")
require('dotenv').config({path: path.resolve(__dirname, "../.env")})

interface Command {
    name: string,
    description: string
}

export class CommandsService {

    static async register(): Promise<void>{
        const rest: REST = new REST({version: '10'}).setToken(process.env.TOKEN as string)
        const commands : Command [] = commandsJSON.commands

        try {
            console.log('Started refreshing application (/) commands.');
            // @ts-ignore
            await  rest.put(Routes.applicationCommands(process.env.CLIENT_ID as string), {body: commands})

        } catch (error){
            console.error(error);
        }
    }
}


