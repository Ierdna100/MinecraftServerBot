import { WebSocket } from "ws";
import { WebSocketAuthenticationRequest } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";

export default class WSAuthenticationHandler extends BaseWSInteractionHandler<WebSocketAuthenticationRequest> {
    public opCode = WSOpcodes.M2D_AuthenticationRequest as const;

    public async handle(socket: WebSocket, data: WebSocketAuthenticationRequest): Promise<void> {}
}
