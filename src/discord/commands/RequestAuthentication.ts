import {
    SlashCommandBuilder,
    InteractionReplyOptions,
    SlashCommandStringOption,
    GuildMemberRoleManager,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonComponent,
    ButtonBuilder
} from "discord.js";
import SlashCommandBase, { CommandInteraction, CommandOptions } from "./SlashCommandBase.js";
import { EnvManager } from "../../EnvManager.js";
import MongoManager from "../../database/MongoManager.js";
import DiscordClient from "../DiscordClient.js";
import { ButtonFactory_AcceptAuthentication, ButtonFactory_RejectAuthentication } from "../buttons/AuthenticationResponse.js";
import { EmbedColors } from "../../dto/EmbedColors.js";

export default class SlashCommand_RequestAuthentication extends SlashCommandBase {
    // prettier-ignore
    public commandBuilder = new SlashCommandBuilder()
        .setName("authenticate")
        .setDescription("Request to be authenticated into the Minecraft server.")
        .addStringOption(new SlashCommandStringOption()
            .setName("minecraft_name")
            .setDescription("Your unique Minecraft name.")
            .setRequired(true));

    public async reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        const minecraftName = options.getString("minecraft_name", true);

        const existingUser = await MongoManager.collections.authenticatedUsers.findOne({ discordUserId: userId });
        if (existingUser != null) {
            for (const account of existingUser.accounts) {
                if (account.minecraftName == minecraftName) {
                    return this.success("Your account is already authenticated!");
                }
            }
        }

        // If not in a DMs
        let autoAuthenticate = !interaction.guild != null;
        // And is in the server with the bot
        autoAuthenticate &&= DiscordClient.instance.publicBroadcastChannel.guild.members.cache.has(userId);
        // And has role for auto-authentication
        autoAuthenticate &&= ((await DiscordClient.instance.publicBroadcastChannel.guild.members.fetch(userId)).roles as GuildMemberRoleManager).cache.has(
            EnvManager.env.autoAuthenticateRoleId
        );

        if (autoAuthenticate) {
            if (existingUser != null) {
                existingUser.accounts.push({ minecraftName: minecraftName, banned: false, minecraftUUID: "", ipAddresses: [] });
                await MongoManager.collections.authenticatedUsers.replaceOne({ _id: existingUser._id }, existingUser);
                return this.success("Your new account is now authenticated!");
            } else {
                await MongoManager.collections.authenticatedUsers.insertOne({
                    discordUserId: userId,
                    accounts: [{ minecraftName: minecraftName, banned: false, minecraftUUID: "", ipAddresses: [] }]
                });
                return this.success("Your account is now authenticated!");
            }
        } else {
            const existingAwaitingUser = await MongoManager.collections.awaitingAuthenticationUsers.findOne({ discordUserId: userId });
            if (existingAwaitingUser != null && existingAwaitingUser.minecraftName == minecraftName) {
                return this.failure("You have already requested an authentication for this account!");
            }

            const insertedUser = await MongoManager.collections.awaitingAuthenticationUsers.insertOne({ discordUserId: userId, minecraftName: minecraftName });
            const insertedIdHex = insertedUser.insertedId.toString();

            this.alertAuthenticationRequest(userId, insertedIdHex, minecraftName);

            return this.awaiting("Your request to authenticate has gone through! Please wait for moderator approval.");
        }
    }

    private async alertAuthenticationRequest(executorId: string, insertedIdHex: string, minecraftName: string) {
        // prettier-ignore
        const actionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonFactory_RejectAuthentication().build(insertedIdHex),
                new ButtonFactory_AcceptAuthentication().build(insertedIdHex));

        const embed = new EmbedBuilder()
            .setTitle("Authentication Request")
            .setDescription("Status: Awaiting authentication")
            .setColor(EmbedColors.Yellow)
            .setTimestamp(new Date())
            .addFields([
                {
                    name: "Discord identifier",
                    value: `\`${executorId}\``
                },
                {
                    name: "Discord name",
                    value: `\`${DiscordClient.instance.client.users.cache.get(executorId)!.displayName}\``
                },
                {
                    name: "Minecraft name",
                    value: `\`${minecraftName}\``
                }
            ]);

        DiscordClient.instance.authenticationRequestsChannel.send({
            content: `<@&${EnvManager.env.authenticationRequestsPingRoleId}>`,
            embeds: [embed],
            components: [actionRow]
        });
    }
}
