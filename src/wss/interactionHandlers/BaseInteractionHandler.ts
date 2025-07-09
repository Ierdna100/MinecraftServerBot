import { WebSocket } from "ws";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import { WebsocketData } from "../dto/MessageSchemas.js";

export default abstract class BaseWSInteractionHandler<T extends WebsocketData> {
    abstract opCode: T["opcode"];

    abstract handle(socket: WebSocket, data: T): Promise<void>;
}
