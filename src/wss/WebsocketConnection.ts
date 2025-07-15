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

        ws.on("open", () => this.onConnection());
        ws.on("error", (error: Error) => this.onError(error));
        ws.on("close", (code: number, reason: Buffer) => this.onClose(code, reason.toString()));
        ws.on("message", (data: RawData, isBinary: boolean) => this.onMessage(data.toString()));
    }

    public onConnection() {
        Logger.info(`New websocket connectioned opened.`);
    }

    public authenticate() {
        Logger.info(`New websocket connectioned authenticated.`);
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

        Logger.detail(`Received websocket opcode ${structuredData.opcode} with data ${JSON.stringify(structuredData.data)}`);
        handler.handle(this, structuredData.data);
    }

    private onClose(code: number, reason: string) {
        Logger.info(`Websocket closed with code ${code}: ${reason.trim() == "" ? "No reason" : reason}`);
    }

    private onError(error: Error) {
        Logger.error(error.stack == undefined ? error.message : error.stack);
    }
}
