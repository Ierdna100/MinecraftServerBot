import { EmbedBuilder } from "discord.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { PeriodicMessageBase } from "../PeriodicMessage.js";
import { EmbedColors } from "../EmbedColors.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { DiscordClient } from "../DiscordClient.js";
import { Application } from "../../Application.js";
import { PeriodicMessageReference, PeriodicMessageType } from "../../dto/PeriodicMessageReference.js";
import { WSServer } from "../../websocketServer/websocketServer.js";

export class PeriodicMessage_MinecraftInfo extends PeriodicMessageBase {
    protected messageType: PeriodicMessageType = PeriodicMessageType.minecraftInfo;

    public async fetchNewestData(): Promise<void> {
        let possibleMessageToUpdate = (await Application.instance.collections.serverData.findOne({
            type: PeriodicMessageType.minecraftInfo
        })) as PeriodicMessageReference | null;

        if (possibleMessageToUpdate != null) {
            this.messageToUpdate = await Application.instance.discordServer.periodicMessages.infoChannel.channel!.messages.fetch(
                possibleMessageToUpdate.messageId
            );
        }

        WSServer.connections.forEach((e) => e.ws.send(JSON.stringify({ opcode: WebsocketOpcodes.globalData })));
    }

    public async updateMessage(data: MinecraftServerInteraction.GlobalData): Promise<void> {
        Application.instance.WSServer.server;

        // prettier-ignore
        const messageEmbeds: EmbedBuilder[] = [
            new EmbedBuilder()
                .setColor(EmbedColors.green)
                .setTitle(`Minecraft server info - **${Application.instance.env.serverIP}**`)
                .setDescription(data.MOTD)
                .addFields(
                    { name: "Seed: ", value: data.seed },
                    { name: "Version: ", value: data.version },
                    { name: "In-game Time: ", value: `Day ${data.day / 24000} (${this.getDayPeriod(data.day)})` },
                    { name: "Minecraft Server Uptime: ", value: this.formatTime(data.mcServerUpTimeMillisec) },
                    { name: "Discord Server Uptime: ", value: this.formatTime(new Date().getTime() - Application.instance.startTime.getTime()) },
                    { name: "Last Backup At: ", value: `<t:${Application.instance.backupManager.lastBackupAt.getTime()}>` }
                )
                .setFooter({ text: "https://github.com/Ierdna100/MinecraftServerBot" })
                .setTimestamp(data.timestamp),
            new EmbedBuilder()
                .setColor(EmbedColors.yellow)
                .setTitle("Previous World Downloads")
                .setDescription("*Coming soon*"),
            new EmbedBuilder()
                .setColor(EmbedColors.blue)
                .setTitle(`Active players (${data.currentPlayers} / ${data.maxPlayers})`)
                .setDescription(this.generatePlayerList(data.currentPlayers))
        ];

        if (this.messageToUpdate == undefined) {
            this.messageToUpdate = await DiscordClient.instance.periodicMessages.infoChannel.channel!.send({
                embeds: messageEmbeds
            });
            await Application.instance.collections.serverData.insertOne({
                messageId: this.messageToUpdate.id,
                type: PeriodicMessageType.minecraftInfo
            });
            return;
        }

        await this.messageToUpdate.edit({ embeds: messageEmbeds });
    }

    private formatTime(time: number): string {
        const minutes = Math.floor((time / 1000) * 60);
        const min_S = minutes > 1 ? "s" : "";
        const hours = Math.floor((time / 1000) * 60 * 60);
        const hour_S = hours > 1 ? "s" : "";
        const days = Math.floor((time / 1000) * 60 * 60 * 24);
        const day_S = days > 1 ? "s" : "";
        // If more than an hour
        if (time > 1000 * 60 * 60) {
            return `${hours} hr${hour_S} ${minutes} min${min_S}`;
        }
        // If more than a day
        else if (time > 1000 * 60 * 60 * 24) {
            return `${days} day${day_S} ${hours} hr${hour_S} ${minutes} min${min_S}`;
        } else {
            return `${minutes} min${min_S}`;
        }
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
}
