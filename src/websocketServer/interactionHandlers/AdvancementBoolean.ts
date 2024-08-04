import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../dto/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_AdvancementBoolean implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.advancementBoolean;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        const data = buffer as MinecraftServerInteraction.AdvancementNonProgressibleAcquired;

        const player = (await MinecraftUser.getUserByUUID(data.uuid))!;

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.purple)
            .setTitle(`**${player.displayName} acquired advancement ${data.name}**`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.advancements.insertOne(buffer);
    }
}

export default WSInteractionResponder_AdvancementBoolean;
