import { EmbedBuilder } from "discord.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../dto/EmbedColors.js";
import { generateDeathMessage } from "../../dto/DeathMessages.js";
import { Application } from "../../Application.js";

class WSInteractionResponder_DeathByEntity implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.deathWithItem;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.DeathWithItem;
        data.deathType = "byPlayerWithItem";

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.red)
            .setTitle(await generateDeathMessage(data.key, data.killed, data.killer, data.killerIsPlayer, data.killerType, data.itemName));

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.deaths.insertOne(data);
    }
}

export default WSInteractionResponder_DeathByEntity;
