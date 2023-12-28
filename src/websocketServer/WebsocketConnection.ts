import { WebSocket } from "ws";
import { Logger } from "../logging/Logger.js";
import { IBaseWSInteraction } from "../dto/BaseWSInteraction.js";
import { WSInteractionsLoader } from "./EndpointLoader.js";
import { Application } from "../Application.js";
import { WebSocketCloseCodes } from "../dto/WebsocketCloseCodes.js";
import { MongoModel_MinecraftUser } from "../dto/MongoModels.js";
import { MinecraftUser } from "../dto/MinecraftUser.js";

export class WebsocketConnection {
    public ws: WebSocket;
    public lastPongTime: Date | undefined;

    constructor(ws: WebSocket) {
        this.ws = ws;

        Logger.info("Minecraft client connected");
        this.pingClient();

        ws.on("message", (buffer: string) => {
            let data = JSON.parse(buffer) as IBaseWSInteraction;

            for (const interaction of WSInteractionsLoader.interactions) {
                if (interaction.interactionType == data.interactionType) {
                    data.data.timestamp = new Date();
                    interaction.reply(data.data);
                    break;
                }
            }
        });

        ws.on("pong", () => {
            if (this.lastPongTime == undefined) {
                this.lastPongTime = new Date();
                setTimeout(this.pingClient, Application.instance.env.WSPingFreq);
                return;
            }

            if (new Date().getTime() - this.lastPongTime.getTime() > Application.instance.env.WSPingTimeoutMs) {
                ws.close(WebSocketCloseCodes.timeout);
                return;
            }

            setTimeout(this.pingClient, Application.instance.env.WSPingFreq);
        });

        ws.on("close", () => {
            Logger.info("Minecraft client disconnected");
        });

        const allAuthedUsers = Application.instance.collections.auth.find() as unknown as MongoModel_MinecraftUser[];
        let allValidUsers: { displayName: string; uuid: string | undefined; allowedIps: string[] }[] = [];
        for (const user of allAuthedUsers) {
            if (user.allowedIps.length == 0 || user.displayName == undefined || user.displayName == "") {
                continue;
            }

            allValidUsers.push({ displayName: user.displayName, uuid: user.uuid, allowedIps: user.allowedIps });
        }

        if (allValidUsers.length != 0) {
            ws.send(JSON.stringify(allValidUsers));
        }
    }

    private async pingClient() {
        this.ws.ping();
    }
}
