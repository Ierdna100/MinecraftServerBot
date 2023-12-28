import { Application } from "../Application.js";
import { Server, WebSocket } from "ws";
import { WSInteractionsLoader } from "./EndpointLoader.js";
import { WebsocketConnection } from "./WebsocketConnection.js";

export class WSServer {
    public static instance: WSServer;
    public server: Server;

    constructor() {
        WSServer.instance = this;

        this.server = new WebSocket.Server({ port: Application.instance.env.WSPort });
        this.initializeServer();
    }

    private async initializeServer() {
        await new WSInteractionsLoader().loadInteractionReplies();

        WSServer.instance.server.on("connection", (ws: WebSocket) => new WebsocketConnection(ws));
    }
}
