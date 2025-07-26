import { MessagePayload, BaseMessageOptions, EmbedBuilder, Colors, TextChannel, WebSocketManager } from "discord.js";
import { EnvManager } from "../../EnvManager.js";
import { PermanentMessageBase } from "./PermanentMessageBase.js";
import { PermanentMessageIdentifier } from "./PermanentMessageIdentifier.js";
import { ServerInfo } from "../../wss/dto/MessageSchemas.js";
import WSServer from "../../wss/WSServer.js";
import { WSOpcodes } from "../../wss/dto/WSOpcodes.js";
import { EmbedColors } from "../../dto/EmbedColors.js";

export class ServerInfoPermanentMessage extends PermanentMessageBase<ServerInfo> {
    public static instance: ServerInfoPermanentMessage;

    protected data: ServerInfo | undefined;

    // prettier-ignore
    private constantServerInfo = new EmbedBuilder()
        .setTitle(`${EnvManager.env.serverInfoEmbedTitle} - ${EnvManager.env.serverInfoEmbedIp}`)
        .setDescription(this.getRandomMoTD())
        .setFooter({ text: "https://github.com/Ierdna100/MinecraftServerBot" });

    constructor(channel: TextChannel) {
        super(PermanentMessageIdentifier.ServerInfo, channel, EnvManager.env.updateFreqServerInfoMillisec);
        ServerInfoPermanentMessage.instance = this;
    }

    protected async fetchData(): Promise<void> {
        WSServer.instance.sendStructuredToAll({ opcode: WSOpcodes.D2M_ServerInfoRequest });
    }

    protected async processDataAndUpdate(): Promise<string | MessagePayload | BaseMessageOptions> {
        if (this.data != undefined) {
            this.constantServerInfo.setColor(EmbedColors.Green).setTimestamp(new Date()).setDescription(this.getRandomMoTD());
            const serverInfo = new EmbedBuilder()
                .setTitle("Server is running")
                .setDescription(`Uptime: ${this.formatTime(this.data.uptimeSeconds * 1000)}`)
                .setColor(EmbedColors.Green)
                .setFields([
                    { name: "Seed: ", value: this.data.seed },
                    { name: "Version: ", value: this.data.version },
                    {
                        name: "In-game time: ",
                        value: `Day ${Math.floor(this.data.serverTimeOfDay / 24000)} (${this.getDayPeriod(this.data.serverTimeOfDay)})`
                    },
                    { name: "Last backup at: ", value: "Backup system offline | No previous backup." }
                ]);

            const playerList = new EmbedBuilder()
                .setColor(Colors.Blue)
                .setTitle(`Online players (${this.data.currentPlayerCount} / ${this.data.maxPlayers})`)
                .setDescription(this.generatePlayerList(this.data.currentPlayers));

            return { embeds: [this.constantServerInfo, serverInfo, playerList] };
        } else {
            this.constantServerInfo.setColor(EmbedColors.Red).setTimestamp(new Date()).setDescription(this.getRandomMoTD());
            const serverInfo = new EmbedBuilder().setTitle("Server is offline").setColor(EmbedColors.Red);
            return { embeds: [this.constantServerInfo, serverInfo] };
        }
    }

    private generatePlayerList(players: string[]): string {
        if (players.length == 0) {
            // prettier-ignore
            return "```\n" 
            + "No players currently online!\n" 
            + "```";
        }

        let str = "```\n";

        let idx = 1;
        const padQty = players.length == 1 ? 1 : Math.ceil(Math.log10(players.length));
        for (const player of players) {
            const paddedIdx = (idx++).toString().padStart(padQty, " ");

            str += `${paddedIdx}. ${player}\n`;
        }

        str += "```";

        return str;
    }

    private getRandomMoTD(): string {
        return EnvManager.env.serverInfoMoTDList[Math.floor(Math.random() * EnvManager.env.serverInfoMoTDList.length)];
    }

    private getDayPeriod(time: number) {
        time = time % 24000;
        if (time > 23000) return "sunrise";
        if (time > 18000) return "midnight";
        if (time > 13000) return "night";
        if (time > 12000) return "sunset";
        if (time > 6000) return "noon";
        if (time > 1000) return "day";
        else return "sunrise";
    }

    private formatTime(milliseconds: number): string {
        const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
        const min_S = minutes > 1 ? "s" : "";

        const hours = Math.floor(milliseconds / (1000 * 60 * 60)) % 24;
        const hour_S = hours > 1 ? "s" : "";

        const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
        const day_S = days > 1 ? "s" : "";

        let out = "";
        if (days != 0) {
            out += `${days} day${day_S} `;
        }

        if (hours != 0) {
            out += `${hours} hr${hour_S} `;
        }

        if (minutes != 0) {
            out += `${minutes} min${min_S}`;
        }

        if (out == "") return "0 min";
        return out;
    }
}
