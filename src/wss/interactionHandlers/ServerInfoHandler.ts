import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import { ServerInfo } from "../dto/MessageSchemas.js";
import WebsocketConnection from "../WebsocketConnection.js";
import { ServerInfoPermanentMessage } from "../../discord/permamessages/PermanentMessages.js";

export class WSServerInfoHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_ServerInfo as const;

    public async handle(conn: WebsocketConnection, data: ServerInfo): Promise<void> {
        ServerInfoPermanentMessage.instance.reply(data);
    }
}
