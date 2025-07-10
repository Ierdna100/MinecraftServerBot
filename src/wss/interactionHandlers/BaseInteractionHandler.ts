import { WebSocket } from "ws";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import WebsocketConnection from "../WebsocketConnection.js";

export default abstract class BaseWSInteractionHandler {
    abstract opCode: WSOpcodes;

    abstract handle(conn: WebsocketConnection, data: any): Promise<void>;
}
