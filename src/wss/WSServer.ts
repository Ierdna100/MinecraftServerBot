import { WebSocketServer } from "ws";
import { EnvManager } from "../EnvManager.js";
import WebsocketConnection from "./WebsocketConnection.js";
import { Logger } from "../logging/Logger.js";
import { WSOpcodes } from "./dto/WSOpcodes.js";

export default class WSServer {
    public static instance: WSServer;

    public server: WebSocketServer;
    private connections: WebsocketConnection[] = [];

    constructor() {
        WSServer.instance = this;
    }

    public initialize() {
        Logger.info("Initializing websocket...");
        this.server = new WebSocketServer({ port: EnvManager.env.websocketPort });
        this.server.on("connection", (websocket) => new WebsocketConnection(websocket));
    }

    public registerConnection(connection: WebsocketConnection) {
        this.connections.push(connection);
    }

    public closeConnection(connection: WebsocketConnection) {
        const index = this.connections.indexOf(connection);
        this.connections.splice(index);
    }

    public sendStructuredToAll(data: { opcode: WSOpcodes; data?: any }) {
        this.sendToAll(JSON.stringify(data));
    }

    public sendToAll(data: string) {
        this.connections.forEach((c) => c.websocket.send(data));
    }
}
