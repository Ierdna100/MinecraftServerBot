import { EmbedBuilder } from "discord.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import WebsocketConnection from "../WebsocketConnection.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { EmbedColors } from "../../dto/EmbedColors.js";
import { PlayerLeft } from "../dto/MessageSchemas.js";
import MongoManager from "../../database/MongoManager.js";
import { Logger } from "../../logging/Logger.js";

export default class WSPlayerLeftHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_PlayerLeft as const;

    public async handle(conn: WebsocketConnection, data: PlayerLeft): Promise<void> {
        const user = await MongoManager.getAccountByUUID(data.uuid);
        if (user == null) {
            Logger.error(`User with UUID ${data.uuid} disconnected but no user was found matching in the database.`);
            return;
        }

        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(`**${user.accounts[0].minecraftName}** left the game: ${data.reason}!`)
            .setColor(EmbedColors.red)
            .setTimestamp(new Date());

        Logger.broadcastPublic({ embeds: [embed] });
    }
}
