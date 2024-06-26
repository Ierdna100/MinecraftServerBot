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
import { WebsocketConnection } from "../../websocketServer/WebsocketConnection.js";
import { DiscordAuthentication } from "../../administration/DiscordAuthentication.js";
import { DiscordAuthLevel } from "../../dto/DiscordAuthData.js";
import { WSServer } from "../../websocketServer/websocketServer.js";

class DiscordCommand_RegisterUser extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("register_user")
        .setDescription("Register new user")
            .addUserOption(new SlashCommandUserOption()
                .setName("id")
                .setDescription("Discord ID of user")
                .setRequired(true))
            .addStringOption(new SlashCommandStringOption()
                .setName("minecraft_name")
                .setDescription("Minecraft name")
                .setRequired(true));

    async reply(
        interaction: ChatInputCommandInteraction<CacheType>,
        userId: string,
        options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
    ): Promise<void> {
        if ((await DiscordAuthentication.getUserAuthLevel(userId)) < DiscordAuthLevel.admin) {
            await interaction.reply("You are not an administrator!");
            return;
        }

        const data = {
            discordUser: options.getUser("id", true).id,
            minecraftName: options.getString("minecraft_name", true)
        };

        const existingUser = (await Application.instance.collections.auth.findOne({
            discordUser: data.discordUser
        })) as unknown as MongoModel_MinecraftUser;

        if (existingUser != null) {
            await Application.instance.collections.auth.replaceOne(
                { _id: existingUser._id },
                {
                    discordUser: existingUser.discordUser,
                    displayName: data.minecraftName,
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

export default DiscordCommand_RegisterUser;
