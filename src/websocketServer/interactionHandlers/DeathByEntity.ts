import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { generateDeathMessage } from "../../dto/DeathMessages.js";

class WSInteractionResponder_DeathByEntity implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.deathByEntity;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.DeathByEntity;

        if (data.killerIsPlayer) {
            data.deathType = "byPlayer";
        } else {
            data.deathType = "byEntity";
        }

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.red)
            .setTitle(await generateDeathMessage(data.key, data.killed, data.killer, data.killerIsPlayer, data.killerType));

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.deaths.insertOne(data);
    }
}

export default WSInteractionResponder_DeathByEntity;
