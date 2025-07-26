import { Colors, EmbedBuilder } from "discord.js";
import { Logger } from "../../logging/Logger.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import { Advancement } from "../dto/MessageSchemas.js";
import WebsocketConnection from "../WebsocketConnection.js";
import MongoManager from "../../database/MongoManager.js";

export class WSAdvancementHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_Message as const;

    public async handle(conn: WebsocketConnection, data: Advancement): Promise<void> {
        const embed = new EmbedBuilder().setTimestamp(new Date());
        const user = await MongoManager.getAccountByUUID(data.uuid);

        if (user == null) {
            Logger.error(`User with UUID ${data.uuid} got advancement but no user was found matching in the database.`);
            return;
        }

        if (data.isBoolean || data.isDone || data.obtainedRequirements == data.requiredRequirements) {
            embed.setTitle(`**${user.accounts[0].minecraftName}** acquired advancement '**${data.advancementName}**'`);
            embed.setColor(Colors.Blurple);
        } else {
            embed.setTitle(
                `**${user.accounts[0].minecraftName}** progressed in advancement '**${data.advancementName}**' ` +
                    `(${data.obtainedRequirements}/${data.requiredRequirements} - ${Math.round(
                        (100 * data.obtainedRequirements) / data.requiredRequirements
                    )}%)`
            );
            embed.setColor(Colors.Blue);
        }

        Logger.broadcastPublic({ embeds: [embed] });
    }
}
