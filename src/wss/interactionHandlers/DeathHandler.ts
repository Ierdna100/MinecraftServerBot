import { Colors, EmbedBuilder } from "discord.js";
import { Logger } from "../../logging/Logger.js";
import { Death, Message } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import WebsocketConnection from "../WebsocketConnection.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { formatStringMinecraft } from "../../dto/Text.js";
import MongoManager from "../../database/MongoManager.js";
import LanguageManager from "../../LanguageManager.js";

export default class WSDeathHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_Death as const;

    public async handle(conn: WebsocketConnection, data: Death): Promise<void> {
        const args = await this.getArgs(data);

        if (args == undefined) {
            return;
        }

        // prettier-ignore
        const embed = new EmbedBuilder()
            .setTitle(formatStringMinecraft(LanguageManager.formatterFromKey(data.messageKey), ...args))
            // .setDescription(data.message)
            .setColor(Colors.Gold)
            .setTimestamp(new Date());

        Logger.broadcastPublic({ embeds: [embed] });
    }

    private async getArgs(data: Death): Promise<string[] | undefined> {
        const args: string[] = [];

        const killed = await MongoManager.getAccountByUUID(data.killedUuid);
        if (killed == null) {
            Logger.error(`User with UUID ${data.killedUuid} was killed but no matching account was found in database.`);
            return undefined;
        } else {
            args.push(`**${killed.accounts[0].minecraftName}**`);
        }

        // Only killed data is available.
        if (data.killerUuid == null) {
            return args;
        }

        if (data.killerType == "player") {
            const killer = await MongoManager.getAccountByUUID(data.killerUuid);
            if (killer == null) {
                Logger.error(`User with UUID ${data.killedUuid} was killed but no matching account was found in database.`);
                return undefined;
            } else {
                args.push(`**${killer.accounts[0].minecraftName}**`);
            }
        } else {
            args.push(`*${LanguageManager.fromKey(LanguageManager.entityStringFromPartial(data.killerType!))}*`);
        }

        // Only killed and killer data is available.
        if (data.itemType == null) {
            return args;
        }

        args.push(`*__${LanguageManager.fromKey(LanguageManager.entityStringFromPartial(data.itemType!))}__*`);

        return args;
    }
}
