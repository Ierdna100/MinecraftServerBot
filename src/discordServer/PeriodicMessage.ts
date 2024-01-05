import { Channel, EmbedBuilder, Message, TextChannel } from "discord.js";
import { Logger } from "../logging/Logger.js";
import { WebsocketConnection } from "../websocketServer/WebsocketConnection.js";
import { WebsocketOpcodes } from "../dto/WebsocketOpcodes.js";
import { MinecraftServerInteraction } from "../dto/HTTPEndpointsStruct.js";
import { EmbedColors } from "./EmbedColors.js";
import { DiscordClient } from "./DiscordClient.js";

export class PeriodicMessage {
    public static instance: PeriodicMessage;

    private channel: TextChannel | undefined;
    private messageToUpdate: Message | undefined;

    constructor() {
        PeriodicMessage.instance = this;

        this.initializePeriodicMessaging();
    }

    public async initializePeriodicMessaging() {
        var channel = await DiscordClient.instance.channels.fetch("1138754184192204881");

        if (channel == null || !channel.isTextBased()) {
            throw new Error("Provided channel for continously updated message isn't text based!");
            return;
        }

        channel = channel as TextChannel;
        this.channel = channel;

        this.fetchNewestData();
    }

    public async fetchNewestData() {
        // First connection is likely Minecraft. If not, lmao
        WebsocketConnection.connections[0].ws.send(JSON.stringify({ opcode: WebsocketOpcodes.globalData }));
    }

    public async updateMessage(data: MinecraftServerInteraction.GlobalData) {
        const messageEmbeds: EmbedBuilder[] = [
            new EmbedBuilder()
                .setColor(EmbedColors.green)
                .setTitle(`**Minecraft server info - **${data.ip}**`)
                .setDescription(data.MOTD)
                .addFields(
                    { name: "Seed: ", value: data.seed },
                    { name: "Version: ", value: data.version },
                )
                .setFooter({ text: "https://github.com/Ierdna100/MinecraftServerBot" })
                .setTimestamp(data.timestamp),
            new EmbedBuilder()
                .setColor(EmbedColors.cyan)
                .setTitle(`Active players (${data.currentPlayers} / ${data.maxPlayers})`)
        ]

        if (this.messageToUpdate == undefined) {
            this.messageToUpdate = await this.channel!.send({ embeds: messageEmbeds });
            return;
        }

        this.messageToUpdate.edit({ embeds: messageEmbeds });
    }
}
