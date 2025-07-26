import { Colors, EmbedBuilder } from "discord.js";
import { Logger } from "../../logging/Logger.js";
import { Empty, GameSaved, Message } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import WebsocketConnection from "../WebsocketConnection.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { ServerInfoPermanentMessage } from "../../discord/permamessages/PermanentMessages.js";

export class WSServerStartedHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_ServerStarted as const;

    public async handle(conn: WebsocketConnection, data: Empty): Promise<void> {
        ServerInfoPermanentMessage.instance.serverUpAndReady = true;

        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(`@here **Server started!**`)
            .setColor(Colors.Green)
            .setTimestamp(new Date());

        Logger.broadcastPublic({ embeds: [embed] });
    }
}

export class WSServerStoppedHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_ServerStopped as const;

    public async handle(conn: WebsocketConnection, data: Empty): Promise<void> {
        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(`**Server stopped.**`)
            .setColor(Colors.Red)
            .setTimestamp(new Date());

        Logger.broadcastPublic({ embeds: [embed] });
    }
}

export class WSServerStoppingHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_ServerStopping as const;

    public async handle(conn: WebsocketConnection, data: Empty): Promise<void> {
        ServerInfoPermanentMessage.instance.serverUpAndReady = false;

        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(`@here **Server stopping!**`)
            .setColor(Colors.Green)
            .setTimestamp(new Date());

        Logger.broadcastPublic({ embeds: [embed] });
    }
}

export class WSGameSavedHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_SavedGame as const;

    public async handle(conn: WebsocketConnection, data: GameSaved): Promise<void> {
        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(data.force ? `**Game saved forcefully.**` : `**Game saved automatically.**`)
            .setColor(Colors.Green)
            .setTimestamp(new Date());

        Logger.broadcastPrivate({ embeds: [embed] });
    }
}
