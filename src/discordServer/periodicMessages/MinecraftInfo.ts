import { EmbedBuilder } from "discord.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";
import { PeriodicMessageBase } from "../PeriodicMessage.js";
import { EmbedColors } from "../EmbedColors.js";
import { WebsocketConnection } from "../../websocketServer/WebsocketConnection.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { DiscordClient } from "../DiscordClient.js";
import { Application } from "../../Application.js";
import { PeriodicMessageReference, PeriodicMessageType } from "../../dto/PeriodicMessageReference.js";

export class PeriodicMessage_MinecraftInfo extends PeriodicMessageBase {
    protected messageType: PeriodicMessageType = PeriodicMessageType.minecraftInfo;

    public async fetchNewestData(): Promise<void> {
        let possibleMessageToUpdate = (await Application.instance.collections.serverData.findOne({
            type: PeriodicMessageType.minecraftInfo
        })) as PeriodicMessageReference | null;

        if (possibleMessageToUpdate != null) {
            this.messageToUpdate =
                await Application.instance.discordServer.periodicMessages.infoChannel.channel!.messages.fetch(
                    possibleMessageToUpdate.messageId
                );
        }

        WebsocketConnection.connection.ws.send(JSON.stringify({ opcode: WebsocketOpcodes.globalData }));
    }

    public async updateMessage(data: MinecraftServerInteraction.GlobalData): Promise<void> {
        const messageEmbeds: EmbedBuilder[] = [
            new EmbedBuilder()
                .setColor(EmbedColors.green)
                .setTitle(`Minecraft server info - **${data.ip}**`)
                .setDescription(data.MOTD)
                .addFields({ name: "Seed: ", value: data.seed }, { name: "Version: ", value: data.version })
                .setFooter({ text: "https://github.com/Ierdna100/MinecraftServerBot" })
                .setTimestamp(data.timestamp),
            new EmbedBuilder()
                .setColor(EmbedColors.blue)
                .setTitle(`Active players (${data.currentPlayers} / ${data.maxPlayers})`)
                .setDescription(this.generatePlayerList())
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

    private generatePlayerList(): string {
        if (this.playersOnline.length == 0) {
            // prettier-ignore
            return "```\n" 
            + "No players currently online!\n" 
            + "```";
        }

        let str = "```\n";

        let idx = 1;
        const padQty = this.playersOnline.length == 1 ? 1 : Math.ceil(Math.log10(this.playersOnline.length));
        for (const player of this.playersOnline) {
            const paddedIdx = (idx++).toString().padStart(padQty, " ");

            str += `${paddedIdx}. ${player.displayName}\n`;
        }

        str += "```";

        return str;
    }

    public async onPlayerJoined(uuid: string) {
        const newPlayer = await MinecraftUser.getUserByUUID(uuid);

        if (newPlayer == null) {
            return;
        }

        this.playersOnline.push(newPlayer);
    }

    public async onPlayerLeft(uuid: string) {
        for (let i = 0; i < this.playersOnline.length; i++) {
            if (this.playersOnline[i].uuid == uuid) {
                this.playersOnline.splice(i, 1);
                return;
            }
        }
    }
}
