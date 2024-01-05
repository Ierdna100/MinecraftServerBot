import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";

class WSInteractionResponder_ServerOverloaded implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.serverOverloaded;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.serverOverloadedWarning;

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.yellow)
            .setTitle(`Server running ${data.millisecondsBehind} ms (${data.ticksBehind} ticks) behind!`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.overloads.insertOne(buffer);
    }
}

export default WSInteractionResponder_ServerOverloaded;
