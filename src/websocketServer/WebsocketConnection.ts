import { WebSocket } from "ws";
import { Logger } from "../logging/Logger.js";
import { IBaseWSInteraction } from "../dto/BaseWSInteraction.js";
import { WSInteractionsLoader } from "./WSInteractionsLoader.js";
import { Application } from "../Application.js";
import { WebSocketCloseCodes } from "../dto/WebsocketCloseCodes.js";
import { MongoModel_MinecraftUser } from "../dto/MongoModels.js";
import { InteractionTypes } from "../dto/InteractionTypes.js";
import { MinecraftServerInteraction } from "../dto/HTTPEndpointsStruct.js";

export class WebsocketConnection {
    public static mcinst: WebSocket;
    public ws: WebSocket;
    public pingTime: Date;

    constructor(ws: WebSocket) {
        WebsocketConnection.mcinst = ws;
        this.pingTime = new Date();
        this.ws = ws;

        Logger.info("Minecraft client connected");

        ws.on("message", (buffer: string) => {
            let data = JSON.parse(buffer) as IBaseWSInteraction;

            if (data.opcode == InteractionTypes.allowedMembers) {
                this.sendAuthData();
                return;
            }

            for (const interaction of WSInteractionsLoader.interactions) {
                if (interaction.interactionType == data.opcode) {
                    const finalData: MinecraftServerInteraction.Base = {
                        timestamp: new Date(),
                        ...data.data
                    };
                    interaction.reply(finalData);
                    break;
                }
            }
        });

        ws.on("pong", () => {
            let currentTime = new Date();

            if (currentTime.getTime() - this.pingTime.getTime() > Application.instance.env.WSPingTimeoutMs) {
                console.log(true);
                ws.close(WebSocketCloseCodes.timeout);
                return;
            }

            setTimeout(() => this.pingClient(), Application.instance.env.WSPingFreqMs);
        });

        ws.on("close", () => {
            Logger.info("Minecraft client disconnected");
        });

        this.pingClient();
    }

    public async sendAuthData() {
        const allAuthedUsers = (await Application.instance.collections.auth
            .find({})
            .toArray()) as unknown as MongoModel_MinecraftUser[];
        if (allAuthedUsers != null) {
            let allValidUsers: { uuid: string | undefined; allowedIps: string[] }[] = [];
            for (const user of allAuthedUsers) {
                if (user.uuid == undefined || user.uuid == "") {
                    continue;
                }

                allValidUsers.push({ uuid: user.uuid, allowedIps: user.allowedIps });
            }

            const fullData = {
                opcode: InteractionTypes.allowedMembers,
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
