import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
    CommandInteractionOptionResolver,
    SlashCommandUserOption,
    SlashCommandStringOption,
    User
} from "discord.js";
import { BaseCommand } from "../../dto/BaseCommand.js";
import { Application } from "../../Application.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";
import { DiscordAuthLevel } from "../../dto/DiscordAuthData.js";
import { DiscordAuthentication } from "../../administration/DiscordAuthentication.js";
import { PeriodicMessage_MinecraftInfo } from "../periodicMessages/MinecraftInfo.js";
import { DiscordClient } from "../DiscordClient.js";
import { WebsocketConnection } from "../../websocketServer/WebsocketConnection.js";
import { WSServer } from "../../websocketServer/websocketServer.js";

class DiscordCommand_SendAuthData extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("send_auth_data")
        .setDescription("Sends auth data in case of failure")

    async reply(
        interaction: ChatInputCommandInteraction<CacheType>,
        userId: string,
        options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
    ): Promise<void> {
        if ((await DiscordAuthentication.getUserAuthLevel(userId)) < DiscordAuthLevel.admin) {
            await interaction.reply("You are not an administrator!");
            return;
        }

        WSServer.connections.forEach((e) => e.sendAuthData());
        interaction.reply("Successfully sent auth data!");
    }
}

export default DiscordCommand_SendAuthData;
