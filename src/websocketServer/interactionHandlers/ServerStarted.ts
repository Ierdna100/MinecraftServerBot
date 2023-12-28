import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";

class WSInteractionResponder_ServerStarted implements BaseWSInteraction {
    public interactionType = InteractionTypes.serverStarted;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.green)
            .setTitle(`<@&${Application.instance.env.MCPingRoleId}> server started!`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.starts.insertOne(buffer);
    }
}

export default WSInteractionResponder_ServerStarted;
