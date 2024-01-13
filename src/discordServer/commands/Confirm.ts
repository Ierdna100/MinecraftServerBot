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
import WSInteractionResponder_PlayerFailedLoginNoIp from "../../websocketServer/interactionHandlers/PlayerFailedLoginNoIp.js";

class DiscordCommand_Confirm extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("confirm")
        .setDescription("Confirm a new IP")

    async reply(
        interaction: ChatInputCommandInteraction<CacheType>,
        userId: string,
        options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
    ): Promise<void> {
        const confirmedIp = WSInteractionResponder_PlayerFailedLoginNoIp.IpsAwaitingConfirmation.get(userId);

        if (confirmedIp == undefined) {
            await interaction.reply("Unexpected confirm command.");
            return;
        }

        const existingUser = (await Application.instance.collections.auth.findOne({
            discordUser: userId
        })) as unknown as MongoModel_MinecraftUser;

        await Application.instance.collections.auth.replaceOne(
            { _id: existingUser._id },
            {
                uuid: existingUser.uuid,
                displayName: existingUser.displayName,
                discordUser: existingUser.discordUser,
                allowedIps: existingUser.allowedIps.push(confirmedIp)
            }
        );

        await interaction.reply("Successfully added your new IP!");
    }
}

export default DiscordCommand_Confirm;
