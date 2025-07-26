import { Colors, EmbedBuilder } from "discord.js";
import { Logger } from "../../logging/Logger.js";
import { Message } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import WebsocketConnection from "../WebsocketConnection.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";

/**
 * @deprecated
 */
export default class WSMessageHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_Message as const;

    public async handle(conn: WebsocketConnection, data: Message): Promise<void> {
        return;

        if (data.uuid != null) {
            return;
        }

        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(`**Server sent message**`)
            .setDescription(data.message)
            .setColor(Colors.Blurple)
            .setTimestamp(new Date());

        Logger.broadcastPublic({ embeds: [embed] });
    }
}
