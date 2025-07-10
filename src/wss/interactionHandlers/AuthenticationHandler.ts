import { WebSocket } from "ws";
import { WebSocketAuthenticationRequest } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";
import { EnvFileFields, EnvManager } from "../../EnvManager.js";
import WebsocketConnection from "../WebsocketConnection.js";

export default class WSAuthenticationHandler extends BaseWSInteractionHandler {
    public opCode = WSOpcodes.M2D_AuthenticationRequest as const;

    public async handle(conn: WebsocketConnection, data: WebSocketAuthenticationRequest): Promise<void> {
        if (data.password != EnvManager.env.websocketPassword) {
            conn.websocket.close(1002, "Invalid Websocket password. Cannot authenticate connection.");
            return;
        }

        conn.authenticate();
        conn.reply(WSOpcodes.D2M_AuthenticationResponse, null);
    }
}
