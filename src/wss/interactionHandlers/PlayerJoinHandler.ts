import { WebSocket } from "ws";
import { PlayerJoin_IPBanned, PlayerJoin_NotWhitelisted, PlayerJoin_Success, PlayerJoin_UnregisteredIP, PlayerJoined } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import WebsocketConnection from "../WebsocketConnection.js";
import DiscordClient from "../../discord/DiscordClient.js";
import { ActionRowBuilder, ButtonBuilder, Colors, EmbedBuilder } from "discord.js";
import { Logger } from "../../logging/Logger.js";
import MongoManager from "../../database/MongoManager.js";
import { ButtonFactory_ConfirmIP, ButtonFactory_DenyIP } from "../../discord/buttons/UnregisteredIPResponse.js";
import { EmbedColors } from "../../dto/EmbedColors.js";

/**
 * @deprecated
 */
export class WSPlayerJoinSuccessHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinSuccess as const;

    public async handle(conn: WebsocketConnection, data: PlayerJoin_Success): Promise<void> {
        const privateEmbed = new EmbedBuilder()
            .setTitle(`**${data.name}** joined the game!`)
            .setFields([
                { name: "IP", value: data.ip },
                { name: "UUID", value: data.uuid }
            ])
            .setColor(Colors.DarkGreen)
            .setTimestamp(new Date());

        Logger.broadcastPrivate({ embeds: [privateEmbed] });
    }
}

export class WSPlayerJoinHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_PlayerJoin as const;

    public async handle(conn: WebsocketConnection, data: PlayerJoined): Promise<void> {
        const privateEmbed = new EmbedBuilder()
            .setTitle(`**${data.name}** joined the game!`)
            .setFields([
                { name: "IP", value: data.ip },
                { name: "UUID", value: data.uuid }
            ])
            .setColor(Colors.DarkGreen)
            .setTimestamp(new Date());

        // prettier-ignore
        const publicEmbed = new EmbedBuilder()
            .setTitle(`**${data.name}** joined the game!`)
            .setColor(Colors.DarkGreen)
            .setTimestamp(new Date());

        MongoManager.collections.authenticatedUsers.findOneAndUpdate(
            {
                "accounts.minecraftName": data.name
            },
            {
                $set: {
                    "accounts.$.minecraftUUID": data.uuid
                }
            }
        );

        Logger.broadcastPrivate({ embeds: [privateEmbed] });
        Logger.broadcastPrivate({ embeds: [publicEmbed] });
    }
}

export class WSPlayerJoinFailIPBannedHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinFail_IPBanned as const;

    public async handle(conn: WebsocketConnection, data: PlayerJoin_IPBanned): Promise<void> {
        const privateEmbed = new EmbedBuilder()
            .setTitle(`**${data.name}** could not join the game! Reason: IP banned!`)
            .setFields([
                { name: "IP", value: data.ip },
                { name: "UUID", value: data.uuid }
            ])
            .setColor(Colors.Red)
            .setTimestamp(new Date());

        Logger.broadcastPrivate({ embeds: [privateEmbed] });
    }
}

export class WSPlayerJoinFailNotWhitelistedHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinFail_NotWhitelisted as const;

    public async handle(conn: WebsocketConnection, data: PlayerJoin_NotWhitelisted): Promise<void> {
        const privateEmbed = new EmbedBuilder()
            .setTitle(`**${data.name}** could not join the game! Reason: Not Whitelisted!`)
            .setFields([
                { name: "IP", value: data.ip },
                { name: "UUID", value: data.uuid }
            ])
            .setColor(Colors.Red)
            .setTimestamp(new Date());

        Logger.broadcastPrivate({ embeds: [privateEmbed] });
    }
}

export class WSPlayerJoinFailUnregisteredIPHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinFail_UnregisteredIP as const;

    public async handle(conn: WebsocketConnection, data: PlayerJoin_UnregisteredIP): Promise<void> {
        const privateEmbed = new EmbedBuilder()
            .setTitle(`**${data.name}** could not join the game! Reason: Unregistered IP!`)
            .setFields([
                { name: "IP", value: data.ip },
                { name: "UUID", value: data.uuid }
            ])
            .setColor(Colors.Red)
            .setTimestamp(new Date());

        Logger.broadcastPrivate({ embeds: [privateEmbed] });

        const fullUser = await MongoManager.collections.authenticatedUsers.findOne({ accounts: { $elemMatch: { minecraftName: data.name } } });
        if (fullUser == null) {
            Logger.error(`Accessing a full user's data from a player join returned null, which should be invalid.`);
            return;
        }

        const id = (
            await MongoManager.collections.awaitingIPConfirms.insertOne({
                userToModifyMongoId: fullUser._id.toHexString(),
                minecraftName: data.name,
                ipToAdd: data.ip
            })
        ).insertedId;

        const component = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonFactory_ConfirmIP().build(id.toHexString()),
            new ButtonFactory_DenyIP().build(id.toHexString())
        );

        const success = DiscordClient.trySendMessageToUser(fullUser.discordUserId, {
            content:
                `Someone tried to join the Minecraft server from an account with the unrecognized IP ${data.ip}. ` +
                `If this was you, confirm your new IP with the button below. If it wasn't, please report the incident.`,
            components: [component]
        });

        if (!success) {
            Logger.warn(`User with ID ${fullUser.discordUserId} is not reachable to confirm a new IP!`);
            Logger.broadcastPrivate(`User <@${fullUser.discordUserId}> (${fullUser.discordUserId}) is not reachable to confirm a new IP!`);
        }
    }
}
