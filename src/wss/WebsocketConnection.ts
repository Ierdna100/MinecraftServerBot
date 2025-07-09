import { RawData, WebSocket } from "ws";
import WSServer from "./WSServer.js";
import { Logger } from "../logging/Logger.js";

export default class WebsocketConnection {
    private websocket: WebSocket;

    constructor(ws: WebSocket) {
        WSServer.instance.registerConnection(this);

        this.websocket = ws;

        ws.on("open", () => Logger.info(`New websocket connectioned opened.`));
        ws.on("error", (ws: WebSocket, error: Error) => this.onError(error));
        ws.on("close", (ws: WebSocket, code: number, reason: Buffer) => this.onClose(code, reason.toString()));
        ws.on("message", (ws: WebSocket, data: RawData, isBinary: boolean) => this.onMessage(data.toString()));
    }

    private onMessage(data: string) {}

    private onClose(code: number, reason: string) {}

    private onError(error: Error) {}
}
