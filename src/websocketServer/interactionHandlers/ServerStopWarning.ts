import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";

class WSInteractionResponder_ServerStopWarning implements BaseWSInteraction {
    public interactionType = InteractionTypes.serverStopWarning;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.orange)
            .setTitle(`<@&${Application.instance.env.MCPingRoleId}> server stopping!`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
    }
}

export default WSInteractionResponder_ServerStopWarning;
