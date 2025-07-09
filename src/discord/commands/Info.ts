import { SlashCommandBuilder, InteractionReplyOptions, EmbedBuilder, MessageFlags } from "discord.js";
import SlashCommandBase, { CommandInteraction, CommandOptions } from "./SlashCommandBase.js";
import MongoManager from "../../database/MongoManager.js";
import { Logger } from "../../logging/Logger.js";

const maximumEmbedCount = 10;

export default class SlashCommand_Info extends SlashCommandBase {
    // prettier-ignore
    public commandBuilder = new SlashCommandBuilder()
        .setName("info")
        .setDescription("See which accounts are associated to your Discord user.");

    public async reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        const authedAccounts = await MongoManager.collections.authenticatedUsers.findOne({ discordUserId: userId });
        const awaitingAuthAccounts = await MongoManager.collections.awaitingAuthenticationUsers.find({ discordUserId: userId }).toArray();

        const returnEmbeds: EmbedBuilder[] = [];
        let totalAccounts = awaitingAuthAccounts.length;

        if (authedAccounts != null) {
            totalAccounts += authedAccounts.accounts.length;
            for (const account of authedAccounts.accounts) {
                if (returnEmbeds.length >= maximumEmbedCount - 1) {
                    break;
                }
                const title = `Account with name \`${account.minecraftName}\``;
                if (account.ipAddresses.length == 0) {
                    returnEmbeds.push(this.success(`No IP adresses connected to this account.`, title, true));
                } else {
                    returnEmbeds.push(this.success(`With connected IP addresses:\n\`${account.ipAddresses.join("`\n`")}\``, title, true));
                }
            }
        }

        for (const awaitingAuthAccount of awaitingAuthAccounts) {
            if (returnEmbeds.length >= maximumEmbedCount - 1) {
                break;
            }
            returnEmbeds.push(this.awaiting("Awaiting moderator approval.", `Account with name \`${awaitingAuthAccount.minecraftName}\``, true));
        }

        if (returnEmbeds.length == 0) {
            Logger.info(`User with ID ${userId} has no associated accounts.`);
            return { embeds: [this.failure("No associated accounts with your Discord user!", "Sorry!", true)], flags: MessageFlags.Ephemeral };
        }

        if (returnEmbeds.length >= maximumEmbedCount - 1) {
            returnEmbeds.push(
                this.awaiting(
                    "Why do you have so many accounts? I wrote code specifically to counter this...",
                    `And ${totalAccounts + 1 - maximumEmbedCount} more...`,
                    true
                )
            );
        }

        returnEmbeds.forEach((embed) => embed.setTimestamp(null));
        returnEmbeds[returnEmbeds.length - 1].setTimestamp(new Date());

        Logger.info(`User with ID ${userId} has ${returnEmbeds.length} associated account(s).`);
        return { embeds: returnEmbeds, flags: MessageFlags.Ephemeral };
    }
}
