import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_DeathByEntity implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.deathByEntity;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.deathByEntity;

        let deathMessage = "";

        let killer: MinecraftUser | null = null;
        if (data.isByPlayer) {
            killer = await MinecraftUser.getUserByUUID(data.killer)!;
            deathMessage = `${(await MinecraftUser.getUserByUUID(data.killed))!.displayName} was killed by ${
                killer!.displayName
            }`;
        } else {
            deathMessage = data.msg;
        }

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.red)
            .setTitle(`${deathMessage}`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.deaths.insertOne(data);
    }
}

export default WSInteractionResponder_DeathByEntity;
