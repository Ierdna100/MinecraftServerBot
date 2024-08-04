import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
    CommandInteractionOptionResolver,
    SlashCommandUserOption,
    SlashCommandStringOption,
    User
} from "discord.js";
import { BaseCommand, CommandInteraction, CommandOptions } from "../../dto/BaseCommand.js";
import { Application } from "../../Application.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";
import { WebsocketConnection } from "../../websocketServer/WebsocketConnection.js";
import { DiscordAuthentication } from "../../administration/DiscordAuthentication.js";
import { DiscordAuthLevel } from "../../dto/DiscordAuthData.js";
import { WSServer } from "../../websocketServer/websocketServer.js";

class DiscordCommand_RegisterName extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("register_name")
        .setDescription("Register new Minecraft name")
            .addStringOption(new SlashCommandStringOption()
                .setName("minecraft_name")
                .setDescription("Minecraft name")
                .setRequired(true));

    async reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<void> {
        const minecraftName = options.getString("minecraft_name", true);

        if ((await DiscordAuthentication.getUserAuthLevel(userId)) < DiscordAuthLevel.authRequests) {
            interaction.reply("You are not authenticated, but your request was sent anyway pending review.");
            Application.instance.return;
        }

        const existingUser = (await Application.instance.collections.auth.findOne({
            displayName: minecraftName
        })) as unknown as MongoModel_MinecraftUser;

        if (existingUser != null) {
            await Application.instance.collections.auth.replaceOne(
                { _id: existingUser._id },
                {
                    discordUser: existingUser.discordUser,
                    displayName: minecraftName,
                    uuid: undefined,
                    allowedIps: []
                }
            );
            // Update auth data
            WSServer.connections.forEach((e) => e.sendAuthData());
            await interaction.reply("Successfully replaced user's minecraft name!");
            return;
        } else {
            const newUser: MongoModel_MinecraftUser = {
                discordUser: data.discordUser,
                displayName: data.minecraftName,
                uuid: undefined,
                allowedIps: []
            };

            await Application.instance.collections.auth.insertOne({
                discordUser: newUser.discordUser,
                displayName: data.minecraftName
            });

            // Update auth data
            WSServer.connections.forEach((e) => e.sendAuthData());
            await interaction.reply("Successfully added new user!");
        }
    }
}

export default DiscordCommand_RegisterName;
