import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_DeathByEntity implements BaseWSInteraction {
    public interactionType = InteractionTypes.deathByEntity;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.deathByEntity;

        let killer: MinecraftUser | null = null;
        if (data.isByPlayer) {
            killer = await MinecraftUser.getUserByUUID(data.killer)!;
        }

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.red)
            .setTitle(`${data.msg}`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.deaths.insertOne(data);
    }
}

export default WSInteractionResponder_DeathByEntity;
