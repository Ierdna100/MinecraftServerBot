import { EmbedBuilder } from "discord.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";
import { PeriodicMessageBase } from "../PeriodicMessage.js";
import { EmbedColors } from "../EmbedColors.js";
import { WebsocketConnection } from "../../websocketServer/WebsocketConnection.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { DiscordClient } from "../DiscordClient.js";

export class PeriodicMessage_MinecraftInfo extends PeriodicMessageBase {
    public async fetchNewestData(): Promise<void> {
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
                .setColor(EmbedColors.cyan)
                .setTitle(`Player Activity`)
                .addFields({
                    name: `Active players (${data.currentPlayers} / ${data.maxPlayers})`,
                    value: this.generatePlayerList()
                })
        ];

        if (this.messageToUpdate == undefined) {
            this.messageToUpdate = await DiscordClient.instance.periodicMessages.infoChannel.channel!.send({
                embeds: messageEmbeds
            });
            return;
        }

        this.messageToUpdate.edit({ embeds: messageEmbeds });
    }

    private generatePlayerList(): string {
        if (this.playersOnline.length == 0) {
            return `\`\`\`
            No players currently online!
            \`\`\``;
        }

        let str = "";
        str += `\`\`\`\n`;

        let idx = 1;
        for (const user of this.playersOnline) {
            str += `${idx}. ${user.displayName}\n`;
        }

        str += `\`\`\``;

        return str;
    }

    public async playerJoined(uuid: string) {
        const newPlayer = await MinecraftUser.getUserByUUID(uuid);

        if (newPlayer == null) {
            return;
        }

        this.playersOnline.push(newPlayer);
    }

    public async playerLeft(uuid: string) {
        let indexOfUserWithUuid = 0;
        for (let i = 0; i < this.playersOnline.length; i++) {
            if (this.playersOnline[i].uuid == uuid) {
                this.playersOnline.splice(i, 1);
                return;
            }
        }
    }
}
