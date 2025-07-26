import {
    ActionRow,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonComponent,
    ButtonInteraction,
    ButtonStyle,
    CacheType,
    ColorResolvable,
    EmbedBuilder,
    InteractionUpdateOptions
} from "discord.js";
import ButtonFactoryBase from "./ButtonBase.js";
import { Logger } from "../../logging/Logger.js";
import MongoManager from "../../database/MongoManager.js";
import { ObjectId } from "mongodb";
import DiscordClient from "../DiscordClient.js";
import { EmbedColors } from "../../dto/EmbedColors.js";

export class ButtonFactory_AcceptAuthentication extends ButtonFactoryBase {
    public customButtonId = "accept-auth";

    // prettier-ignore
    public buttonBuilder = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel("Authenticate");

    public async onInteract(interaction: ButtonInteraction<CacheType>, relatedObjectId: ObjectId, executorId: string): Promise<InteractionUpdateOptions> {
        const userToAuthenticate = await MongoManager.collections.awaitingAuthenticationUsers.findOneAndDelete({ _id: relatedObjectId });

        if (userToAuthenticate == null) {
            Logger.warn(`User with ID ${executorId} attempted to authenticate a user but the user did not exist in the database!`);
            return editControlMessage(
                interaction,
                "Status: Authentication rejected - Invalid database state (user to authenticate did not exist)",
                EmbedColors.Red
            );
        } else {
            const existingUser = await MongoManager.collections.authenticatedUsers.findOne({ discordUserId: userToAuthenticate.discordUserId });

            if (existingUser == null) {
                const success = await DiscordClient.trySendMessageToUser(
                    userToAuthenticate.discordUserId,
                    `Your minecraft account with the name '${userToAuthenticate.minecraftName}' was successfully authenticated!`
                );

                if (!success) {
                    Logger.warn(`User with ID ${userToAuthenticate.discordUserId} cannot be contacted by bot! Unable to authenticate!`);
                    return editControlMessage(interaction, "Status: Authentication rejected - User cannot be contacted by bot.", EmbedColors.Red);
                }

                Logger.info(`User with ID ${userToAuthenticate.discordUserId} was successfully authenticated!`);

                MongoManager.collections.authenticatedUsers.insertOne({
                    discordUserId: userToAuthenticate.discordUserId,
                    accounts: [{ minecraftName: userToAuthenticate.minecraftName, ipAddresses: [], banned: false, minecraftUUID: "" }]
                });

                return editControlMessage(interaction, "Status: Authentication accepted", EmbedColors.Green);
            } else {
                for (const account of existingUser.accounts) {
                    if (account.minecraftName == userToAuthenticate.minecraftName) {
                        Logger.warn(`User with ID ${executorId} attempted to authenticate a user but the user was already authenticated!`);
                        return editControlMessage(interaction, "Status: Authentication rejected - User was already authenticated!.", EmbedColors.Green);
                    }
                }

                const success = await DiscordClient.trySendMessageToUser(
                    userToAuthenticate.discordUserId,
                    `Your minecraft account with the name '${userToAuthenticate.minecraftName}' was successfully authenticated!`
                );

                if (!success) {
                    Logger.warn(`User with ID ${userToAuthenticate.discordUserId} cannot be contacted by bot! Unable to authenticate!`);
                    return editControlMessage(interaction, "Status: Authentication rejected - User cannot be contacted by bot.", EmbedColors.Red);
                }

                Logger.info(`User with ID ${userToAuthenticate.discordUserId} was successfully authenticated!`);

                existingUser.accounts.push({ minecraftName: userToAuthenticate.minecraftName, ipAddresses: [], banned: false, minecraftUUID: "" });
                MongoManager.collections.authenticatedUsers.replaceOne({ _id: existingUser._id }, existingUser);

                return editControlMessage(interaction, "Status: Authentication accepted", EmbedColors.Green);
            }
        }
    }
}

export class ButtonFactory_RejectAuthentication extends ButtonFactoryBase {
    public customButtonId = "reject-auth";

    // prettier-ignore
    public buttonBuilder = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Reject");

    public async onInteract(interaction: ButtonInteraction<CacheType>, relatedObjectId: ObjectId, executorId: string): Promise<InteractionUpdateOptions> {
        const userToAuthenticate = await MongoManager.collections.awaitingAuthenticationUsers.findOneAndDelete({ _id: relatedObjectId });

        if (userToAuthenticate == null) {
            Logger.warn(`User with ID ${executorId} attempted to reject authentication of a user but the user did not exist in the database!`);
            return editControlMessage(
                interaction,
                "Status: Authentication rejected - Invalid database state (user to authenticate did not exist)",
                EmbedColors.Red
            );
        } else {
            Logger.info(`User with ID ${userToAuthenticate.discordUserId} was successfully rejected!`);
            return editControlMessage(interaction, "Status: Authentication rejected - Moderator approval failed.", EmbedColors.Red);
        }
    }
}

function editControlMessage(interaction: ButtonInteraction<CacheType>, newDescription: string, newColor: ColorResolvable): InteractionUpdateOptions {
    // prettier-ignore
    const replyEmbed = EmbedBuilder.from(interaction.message.embeds[0])
            .setDescription(newDescription)
            .setColor(newColor)
            .setTimestamp(new Date());

    const replyButtons: ButtonBuilder[] = [];
    for (const buttonComponent of (interaction.message.components[0] as ActionRow<ButtonComponent>).components) {
        replyButtons.push(ButtonBuilder.from(buttonComponent).setDisabled(true));
    }

    const replyActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(replyButtons);

    return { embeds: [replyEmbed], components: [replyActionRow] };
}
