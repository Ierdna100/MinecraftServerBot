import { RawData, WebSocket } from "ws";
import WSServer from "./WSServer.js";
import { Logger } from "../logging/Logger.js";
import { websocketResponses } from "./InteractionHandlers.js";
import { WSOpcodes } from "./dto/WSOpcodes.js";

export default class WebsocketConnection {
    public websocket: WebSocket;
    private ready = false;

    constructor(ws: WebSocket) {
        WSServer.instance.registerConnection(this);

        this.websocket = ws;

        ws.on("open", () => Logger.info(`New websocket connectioned opened.`));
        ws.on("error", (ws: WebSocket, error: Error) => this.onError(error));
        ws.on("close", (ws: WebSocket, code: number, reason: Buffer) => this.onClose(code, reason.toString()));
        ws.on("message", (ws: WebSocket, data: RawData, isBinary: boolean) => this.onMessage(data.toString()));
    }

    public authenticate() {
        this.ready = true;
    }

    public reply(opcode: WSOpcodes, data: any | null) {
        if (!this.ready) return;
        this.websocket.send(JSON.stringify({ opcode: opcode, data: data }));
    }

    private onMessage(data: string) {
        let structuredData = JSON.parse(data) as { opcode: number; data: any };

        const handler = websocketResponses[structuredData.opcode as WSOpcodes];
        if (handler == undefined) {
            Logger.fatal(`Invalid Websocket opcode '${structuredData.opcode}'`);
            throw new Error(`Invalid Websocket opcode '${structuredData.opcode}'`);
        }

        handler.handle(this, structuredData.data);
    }

    private onClose(code: number, reason: string) {}

    private onError(error: Error) {}
}
