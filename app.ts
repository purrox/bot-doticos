import "reflect-metadata";
import {DiscordService} from './services/DiscordService'
import container from "./config/InversifyConfiguration";
import {Message} from "discord.js";
import RedisConfiguration from "./config/RedisConfiguration";
import {CommandsService} from "./commands/CommandsService";
import {MongoConfiguration} from './config/MongoConfiguration';
import {Client, GatewayIntentBits, Events} from 'discord.js'
import logger from "./config/LoggersConfiguration";
require('dotenv/config')

const client: any = new Client({
    intents:[
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
})

const mongoConfig :MongoConfiguration = container.get<MongoConfiguration>(MongoConfiguration);
const discordService: DiscordService = container.get<DiscordService>(DiscordService)

client.on('ready',
    (): void => {

        logger.info('Doticos Bot Ready');
        CommandsService.register();
        mongoConfig.connect();
    })

client.on("messageCreate", (msg:Message) => {
})
// @ts-ignore
client.on(Events.InteractionCreate, async (interaction): Promise<void>  => {

    if (interaction.commandName === 'register') {
        await discordService.registerUser(interaction)
    }
    if(interaction.commandName === 'ping'){
        await interaction.reply(`Hello, ${interaction.user}!`)
    }
    if(interaction.commandName === 'leaderboard'){
        await discordService.getUsersLeaderBoard(interaction)
    }
    if(interaction.commandName === 'creategame') {
        const message = await discordService.createGame(interaction)
        const thread = await message.startThread({name: 'Players in the Queue'})
    }
    if(interaction.isButton()){

        const [action, value]: string [] = interaction.customId.split('-');
        if(action === "add"){
            await discordService.addUserToTheQueue(interaction)
        }else if(action === 'leave'){

        }

    }
    else{
        return
    }

})

client.login(process.env.TOKEN)