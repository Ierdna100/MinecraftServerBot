import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../dto/EmbedColors.js";

class WSInteractionResponder_ServerStopWarning implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.serverStopWarning;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.orange)
            .setTitle(`Minecraft server stopping!`);

        await Application.instance.discordServer.publicLogChannel.send({
            content: `<@&${Application.instance.env.MCPingRoleId}>`,
            embeds: [messageEmbed]
        });
    }
}

export default WSInteractionResponder_ServerStopWarning;
