import {EmbedBuilder, ButtonBuilder, ButtonStyle} from "discord.js";
import {IUser} from "../services/schemas/Users";
import {IGame} from "../services/schemas/Games";

const ERROR_ICON: string = 'https://cdn-icons-png.flaticon.com/512/1810/1810747.png';
const SUCCESS_ICON: string = 'https://cdn-icons-png.flaticon.com/512/716/716225.png '
const LEADERBOARD_ICON: string = 'https://cdn-icons-png.flaticon.com/512/10791/10791557.png';
const CREATE_GAME_ICON: string = 'https://cdn-icons-png.flaticon.com/512/8754/8754287.png'
export const getErrorEmbed = (message: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor("#A4230D")
        .setAuthor({
            name: 'Doticos MatchMaking Bot',
            iconURL: ERROR_ICON
        }) //todo icon for test
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            iconURL: ERROR_ICON,
            text: 'If you continue to experience issues, please contact the server administrator for further assistance. They will be able to help resolve any persistent problems you may encounter. '
        })
        .setColor("#A4230D");
}

export const getSuccessEmbed = (message: string): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor("#A4230D")
        .setAuthor({
            name: 'Doticos MatchMaking Bot',
            iconURL: SUCCESS_ICON
        }) //todo icon for test
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            iconURL: SUCCESS_ICON,
            text: 'Need help? Contact support. Happy exploring!'
        })
        .setColor("#A4230D");
}

export const getLeaderBoard = (users: IUser[], interaction: any): EmbedBuilder => {
    const userLeaderboard = users.map(({internalMMR, lose, mmr, username, win, discord}: IUser, index: number) => {
        // @ts-ignore
        const total: number = win + lose;
        // @ts-ignore
        const percentage: number = (win * 100) / total;
        const target = interaction.getUser(discord)
        return {
            name: `${index + 1}- ${target}      ${internalMMR} / ${mmr} `,
            value: `${percentage ? percentage : 0}% (Win: ${win} Lose: ${lose})  `
        }
    })
    return new EmbedBuilder()
        .setColor("#A4230D")
        .setAuthor({
            name: 'MatchMaking Leaderboard',
            iconURL: LEADERBOARD_ICON
        }) //todo icon for test
        .addFields(userLeaderboard
        )
        .setTimestamp()
        .setFooter({
            iconURL: LEADERBOARD_ICON,
            text: 'Need help? Contact support. Happy exploring!'
        })
        .setColor("#A4230D");
}


export const getCreateGame = (interaction: any, game: IGame | null): EmbedBuilder => {
    return new EmbedBuilder()
        .setColor("#A4230D")
        .setAuthor({
            name: `Game created`,
            iconURL: CREATE_GAME_ICON
        }) //todo icon for test
        .setTimestamp()
        .addFields({
                name: `Game Id: ${game?._id}`,
                value: ' ',
                inline: false
            },
            {
                name: `Lobby: ${game?.name}`,
                value: ' ', inline: false
            },
            {
                name: `Players:`,
                value: ' \n\n PuRr0 \n 50%', inline: false
            }
        )
        .setColor("#A4230D");
}