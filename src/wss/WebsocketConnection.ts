import { RawData, WebSocket } from "ws";
import WSServer from "./WSServer.js";
import { Logger } from "../logging/Logger.js";
import { websocketResponses } from "./InteractionHandlers.js";
import { WSOpcodes } from "./dto/WSOpcodes.js";
import { CloseCodes } from "./dto/WSCloseCodes.js";
import BaseWSInteractionHandler from "./interactionHandlers/BaseInteractionHandler.js";

export default class WebsocketConnection {
    public websocket: WebSocket;
    private ready = false;

    constructor(ws: WebSocket) {
        WSServer.instance.registerConnection(this);

        this.websocket = ws;

        ws.on("error", (error: Error) => this.onError(error));
        ws.on("close", (code: number, reason: Buffer) => this.onClose(code, reason.toString()));
        ws.on("message", (data: RawData, isBinary: boolean) => this.onMessage(data.toString()));

        Logger.info(`New websocket connectioned opened.`);
    }

    public authenticate() {
        Logger.info(`New websocket connectioned authenticated.`);
        this.ready = true;
    }

    public reply(opcode: WSOpcodes, data: any | null) {
        if (!this.ready) {
            return;
        }
        Logger.detail(`Replying: ${JSON.stringify({ opcode: opcode, data: data })}`);
        this.websocket.send(JSON.stringify({ opcode: opcode, data: data }));
    }

    private onMessage(data: string) {
        let structuredData = JSON.parse(data) as { opcode: number; data: any };

        let handler: BaseWSInteractionHandler;
        if (structuredData.opcode == WSOpcodes.M2D_AuthenticationRequest) {
            Logger.detail(`Received websocket opcode ${structuredData.opcode}`);
            if (this.ready) {
                Logger.warn("Websocket tried to authenticate twice. Closing.");
                this.websocket.close(CloseCodes.AlreadyAuthenticated, "Already authenticated.");
                return;
            }
            handler = websocketResponses[structuredData.opcode]!;
        } else {
            Logger.detail(`Received websocket opcode ${structuredData.opcode} with data ${JSON.stringify(structuredData.data)}`);
            if (!this.ready) {
                Logger.warn("Websocket not authenticated. Closing.");
                this.websocket.close(CloseCodes.NotAuthenticated, "Not authenticated.");
                return;
            }

            const possibleHandler = websocketResponses[structuredData.opcode as WSOpcodes];
            if (possibleHandler == undefined) {
                Logger.warn(`Invalid Websocket opcode '${structuredData.opcode}'`);
                this.websocket.close(CloseCodes.InvalidOpCode, "Invalid OpCode.");
                return;
            }
            handler = possibleHandler;
        }

        handler.handle(this, structuredData.data);
    }

    private onClose(code: number, reason: string) {
        Logger.info(`Websocket closed with code ${code}: ${reason.trim() == "" ? "No reason" : reason}`);
    }

    private onError(error: Error) {
        Logger.error(error.stack == undefined ? error.message : error.stack);
    }
}
