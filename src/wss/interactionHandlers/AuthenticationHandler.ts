import { WebSocketAuthenticationRequest } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { EnvManager } from "../../EnvManager.js";
import WebsocketConnection from "../WebsocketConnection.js";
import { CloseCodes } from "../dto/WSCloseCodes.js";

export default class WSAuthenticationHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_AuthenticationRequest as const;

    public async handle(conn: WebsocketConnection, data: WebSocketAuthenticationRequest): Promise<void> {
        if (data.password != EnvManager.env.websocketPassword) {
            conn.websocket.close(CloseCodes.InvalidAuthenticationData, "Invalid Websocket password. Cannot authenticate connection.");
            return;
        }

        conn.authenticate();
        conn.reply(WSOpcodes.D2M_AuthenticationResponse, null);
    }
}
