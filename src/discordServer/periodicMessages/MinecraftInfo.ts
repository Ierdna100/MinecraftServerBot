import { EmbedBuilder } from "discord.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { PeriodicMessageBase } from "../PeriodicMessage.js";
import { EmbedColors } from "../EmbedColors.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { DiscordClient } from "../DiscordClient.js";
import { Application } from "../../Application.js";
import { PeriodicMessageReference, PeriodicMessageType } from "../../dto/PeriodicMessageReference.js";
import { WSServer } from "../../websocketServer/websocketServer.js";
import { MongoModel_WorldDownload } from "../../dto/MongoModels.js";
import { Logger } from "../../logging/Logger.js";

export class PeriodicMessage_MinecraftInfo extends PeriodicMessageBase {
    protected messageType: PeriodicMessageType = PeriodicMessageType.minecraftInfo;

    private updateMessageCallbackID: NodeJS.Timeout | undefined = undefined;

    constructor() {
        super();
        this.initializePeriodicMessage(Application.instance.env.infoChannelId);
        Logger.info("Initialized periodic message for Minecraft Info!");
    }

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
        setTimeout(() => this.fetchNewestData(), Application.instance.env.WSGlobalDataFreqMs);
        this.updateMessageCallbackID = setTimeout(() => this.updateMessage(undefined), Application.instance.env.WSGlobalDataFreqMs * 0.2);
    }

    public async updateMessage(data: MinecraftServerInteraction.GlobalData | undefined): Promise<void> {
        if (this.updateMessageCallbackID != undefined) {
            clearTimeout(this.updateMessageCallbackID);
            this.updateMessageCallbackID = undefined;
        }

        const lastBackupAt =
            Application.instance.backupManager.lastBackupAt != undefined
                ? Math.floor(Application.instance.backupManager.lastBackupAt.getTime() / 1000)
                : undefined;
        const messageEmbeds: EmbedBuilder[] = [];

        const baseMainEmbed = new EmbedBuilder()
            .setTitle(`Minecraft server info - **${Application.instance.env.serverIP}**`)
            .setFooter({ text: "https://github.com/Ierdna100/MinecraftServerBot" });

        // If undefined, it means the server never replied back!
        if (data == undefined) {
            // prettier-ignore
            messageEmbeds.push(
                baseMainEmbed
                    .setColor(EmbedColors.red)
                    .setDescription("Server is offline")
                    .setTimestamp(new Date()));
        } else {
            messageEmbeds.push(
                baseMainEmbed
                    .setColor(EmbedColors.green)
                    .setDescription(data.MOTD)
                    .addFields(
                        { name: "Seed: ", value: data.seed },
                        { name: "Version: ", value: data.version },
                        { name: "In-game Time: ", value: `Day ${Math.floor(data.day / 24000)} (${this.getDayPeriod(data.day)})` },
                        { name: "Minecraft Server Uptime: ", value: this.formatTime(data.mcServerUpTimeMillisec) },
                        { name: "Discord Server Uptime: ", value: this.formatTime(new Date().getTime() - Application.instance.startTime.getTime()) },
                        { name: "Last Backup At: ", value: lastBackupAt == undefined ? "No previous backup" : `<t:${lastBackupAt}>, <t:${lastBackupAt}:R>` }
                    )
                    .setTimestamp(data.timestamp)
            );
            messageEmbeds.push(
                new EmbedBuilder()
                    .setColor(EmbedColors.green)
                    .setTitle(`Active players (${data.currentPlayers.length} / ${data.maxPlayers})`)
                    .setDescription(this.generatePlayerList(data.currentPlayers))
            );
        }

        // prettier-ignore
        messageEmbeds.push(
            new EmbedBuilder()
                .setColor(EmbedColors.yellow)
                .setTitle("Previous World Downloads")
                .setDescription(
                    this.formatWorldDownloads(await Application.instance.collections.worldDownloads.find().toArray() as unknown as MongoModel_WorldDownload[])
            ));

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

    private formatWorldDownloads(data: MongoModel_WorldDownload[]): string {
        if (data.length == 0) {
            return "*No world downloads available*";
        }

        let out = "";
        data.forEach((e) => {
            out += `[${e.markdownTitle}](${e.link})\n`;
        });
        return out;
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
            out += `${days} hr${day_S} `;
        }

        if (hours != 0) {
            out += `${hours} hr${hour_S} `;
        }

        if (minutes != 0) {
            out += `${minutes} hr${min_S}`;
        }

        return out;
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
