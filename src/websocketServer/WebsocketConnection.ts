import { WebSocket } from "ws";
import { Logger } from "../logging/Logger.js";
import { IBaseWSInteraction } from "../dto/BaseWSInteraction.js";
import { WSInteractionsLoader } from "./WSInteractionsLoader.js";
import { Application } from "../Application.js";
import { WebSocketCloseCodes } from "../dto/WebsocketCloseCodes.js";
import { MongoModel_MinecraftUser } from "../dto/MongoModels.js";
import { WebsocketOpcodes } from "../dto/WebsocketOpcodes.js";
import { MinecraftServerInteraction } from "../dto/HTTPEndpointsStruct.js";
import { DiscordClient } from "../discordServer/DiscordClient.js";

export class WebsocketConnection {
    public static connection: WebsocketConnection;

    public ws: WebSocket;
    public pingTime: Date;

    constructor(ws: WebSocket) {
        WebsocketConnection.connection = this;
        this.pingTime = new Date();
        this.ws = ws;

        Logger.info("Client connected");

        ws.on("message", (data: string) => this.onMessage(data));
        ws.on("pong", () => this.onPong());
        ws.on("close", () => this.onClose());

        this.pingClient();
        DiscordClient.instance.periodicMessages.infoChannel.initializePeriodicMessage(
            Application.instance.env.infoChannelId
        );
    }

    private onMessage(buffer: string) {
        let data = JSON.parse(buffer) as IBaseWSInteraction;

        if (data.opcode == WebsocketOpcodes.allowedMembers) {
            this.sendAuthData();
            return;
        }

        for (const interaction of WSInteractionsLoader.interactions) {
            if (interaction.interactionType == data.opcode) {
                const finalData: MinecraftServerInteraction.Base = {
                    timestamp: new Date(),
                    ...data.data
                };

                Logger.info("New reply-able interaction received with opcode: " + data.opcode);
                console.log(data.data);

                interaction.reply(finalData);
                break;
            }
        }
    }

    private onPong() {
        let currentTime = new Date();

        if (currentTime.getTime() - this.pingTime.getTime() > Application.instance.env.WSPingTimeoutMs) {
            console.log(true);
            this.ws.close(WebSocketCloseCodes.timeout);
            return;
        }

        setTimeout(() => this.pingClient(), Application.instance.env.WSPingFreqMs);
    }

    private onClose() {
        Logger.info("Client disconnected");
    }

    public async sendAuthData() {
        console.log("Responding to request to Auth Data");
        const allAuthedUsers = (await Application.instance.collections.auth
            .find({})
            .toArray()) as unknown as MongoModel_MinecraftUser[];
        if (allAuthedUsers != null) {
            let allValidUsers: { uuid: string; allowedIps: string[] }[] = [];
            for (const user of allAuthedUsers) {
                if (user.uuid == undefined || user.uuid == "") {
                    continue;
                }

                allValidUsers.push({ uuid: user.uuid, allowedIps: user.allowedIps });
            }

            const fullData = {
                opcode: WebsocketOpcodes.allowedMembers,
                data: allValidUsers
            };

            console.log(fullData);
            this.ws.send(JSON.stringify(fullData));
        }
    }

    private pingClient() {
        this.pingTime = new Date();
        this.ws.ping();
    }
}
