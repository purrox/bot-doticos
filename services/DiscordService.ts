import "reflect-metadata";
import {injectable, inject} from 'inversify';
import {
    ActionRowBuilder,
    AnyComponentBuilder, ButtonBuilder, ButtonStyle, DiscordAPIError,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle, ChannelType
} from "discord.js";
import {UsersService} from "./UsersService";
import {IUser} from "./schemas/Users";
import logger from "../config/LoggersConfiguration";
import {getErrorEmbed, getLeaderBoard, getSuccessEmbed, getCreateGame} from "../Embeds/Embeds";
import {v4 as uuidv4} from 'uuid';
import {GamesServices} from "./GamesServices";
import {IGame} from "./schemas/Games";

@injectable()
export class DiscordService {

    private userService: UsersService;
    private gamesServices: GamesServices;

    constructor(@inject(UsersService) userService: UsersService, @inject(GamesServices) gamesServices: GamesServices) {
        this.userService = userService;
        this.gamesServices = gamesServices;
    }

    public async registerUser(interaction: any): Promise<void> {
        let id = uuidv4();
        const modal: ModalBuilder = new ModalBuilder()
            .setCustomId(id)
            .setTitle('Register');

        const userName: TextInputBuilder = new TextInputBuilder()
            .setCustomId('dotaUserName')
            .setLabel("Dota User Name")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)

        const mmr: TextInputBuilder = new TextInputBuilder()
            .setCustomId('dotaMMR')
            .setLabel("Dota2 MMR")
            .setMaxLength(6)
            .setPlaceholder(`Only Numbers`)
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
        const firstActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(userName);
        const secondActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(mmr);
        //todo move the above code to a new file?

        // @ts-ignore
        modal.addComponents(firstActionRow, secondActionRow)

        await interaction.showModal(modal);

        const collector = interaction.channel.createMessageComponentCollector({time: 1000});

        collector.on('collect', async (i: any) => {
            if (i.member.id != interaction.user.id) {
                return i.reply({content: `This interaction is not for you`, ephemeral: true})
            }

            if (i.customId === id) {
                logger.info(i.customId)
            }
        });

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
        }).catch((error: any): void => {
            logger.error('Something happen with the modal', error.toJSON)
        })

        if (submitted) {
            try {
                const userData: IUser = ({
                    username: submitted.fields.getTextInputValue('dotaUserName'),
                    mmr: submitted.fields.getTextInputValue('dotaMMR'),
                    discord: interaction.user.username
                })
                const verifyUser: IUser | null = await this.userService.findUser(userData.discord);
                if (verifyUser !== null) {
                    logger.error(`The Discord account that is attempting to register is already associated with an existing account : ${verifyUser.discord} `)
                    await submitted.reply({
                        embeds: [getErrorEmbed(`It appears that the Discord account you are attempting to register ${interaction.user} is already associated with an existing account.`)],
                        ephemeral: true
                    }) //todo move text to constant
                } else {
                    const userSaved: IUser = await this.userService.createUser(userData);

                    const msg: string = `Hi ${interaction.user} Welcome aboard! Your account has been created with an internal mmr ${userSaved.internalMMR}. Enjoy exploring and have a great time with us`
                    await submitted.reply({
                        embeds: [getSuccessEmbed(msg)],
                        ephemeral: true
                    })
                }
            } catch (e: any) {
                if (e.type === "Error") {
                    await submitted.reply({
                        embeds: [getErrorEmbed('The data you provided is invalid. Please review the information you entered and make sure it meets the required format and criteria.')],
                        ephemeral: true
                    })
                } else {
                    try {
                        await submitted.reply({
                            content: 'The data you provided is invalid. Please review the information you entered and make sure it meets the required format and criteria.',
                            ephemeral: true
                        })
                    } catch (e) {
                        logger.error('DiscordAPiError: Handle Unknown/Deferred Interaction Exception')
                    }
                }
            }
        }
    }

    public async getUsersLeaderBoard(interaction: any): Promise<void> {
        const users: IUser[] = await this.userService.userLeaderBoard()
        await interaction.reply({
            embeds: [getLeaderBoard(users, interaction)],
            ephemeral: true
        }) //todo move text to constant

    }

    public async createGame(interaction: any): Promise<any> {

        const discordUserName: string = interaction.user.username;
        const currentUser: IUser | null = await this.userService.findUser(discordUserName);
        const game: IGame | null = await this.gamesServices.createGame(currentUser);

        if(game != null){
            await this.gamesServices.addUserToGame(game?._id, currentUser?.username);
        }
       else {
           return interaction.reply({content: `You have a game already created and is still open ${interaction.user}`})
        }

        const addQueue: ButtonBuilder = new ButtonBuilder()
            .setCustomId(`add-${game?._id}`)
            .setLabel('Enter')
            .setStyle(ButtonStyle.Primary);

        const leaveQueue: ButtonBuilder = new ButtonBuilder()
            .setCustomId(`leave-${game?._id}`)
            .setLabel('Leave')
            .setStyle(ButtonStyle.Danger);

        const buttonActionRow: ActionRowBuilder<AnyComponentBuilder> = new ActionRowBuilder().addComponents(addQueue, leaveQueue);
        return interaction.reply({content:`Game created by ${interaction.user}`,
            embeds:[ getCreateGame(interaction, game)],
            components:[buttonActionRow],
            fetchReply: true
        })

    }

    public async addUserToTheQueue(interaction: any): Promise<any> {

        const [action, value]: string [] = interaction.customId.split('-');
        const userName = interaction.user.username;
        const queue:number = await this.gamesServices.addUserToGame(value, userName);

        // @ts-ignore
        const thread = interaction.channel;
        await thread.send({content:"adasdsad"});
    }

    public async createVoiceChannel(interaction: any){

        const channel = await interaction.guild.channels.create({
            name:'Dire',
            type: ChannelType.GuildVoice,
            userLimit: 10,
            parent:interaction.channel.customId
        })
    }
}