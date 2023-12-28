import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";

class WSInteractionResponder_ServerStop implements BaseWSInteraction {
    public interactionType = InteractionTypes.serverStopped;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.red)
            .setTitle(`Server stopped!`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.stops.insertOne(buffer);
    }
}

export default WSInteractionResponder_ServerStop;
