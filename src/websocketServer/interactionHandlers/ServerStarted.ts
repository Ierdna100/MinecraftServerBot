import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";

class WSInteractionResponder_ServerStarted implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.serverStarted;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.green)
            .setTitle(`Minecraft server started!`);

        await Application.instance.discordServer.publicLogChannel.send({
            content: `<@&${Application.instance.env.MCPingRoleId}>`,
            embeds: [messageEmbed]
        });
        await Application.instance.collections.starts.insertOne(buffer);
    }
}

export default WSInteractionResponder_ServerStarted;
