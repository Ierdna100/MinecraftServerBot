import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_AdvancementBoolean implements BaseWSInteraction {
    public interactionType = InteractionTypes.advancementBoolean;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        const data = buffer as MinecraftServerInteraction.advancementNonProgressibleAcquired;

        const player = (await MinecraftUser.getUserByUUID(data.user))!;

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.purple)
            .setTitle(`**${player.displayName} acquired advancement ${data.advancementName}**`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.advancements.insertOne(buffer);
    }
}

export default WSInteractionResponder_AdvancementBoolean;
