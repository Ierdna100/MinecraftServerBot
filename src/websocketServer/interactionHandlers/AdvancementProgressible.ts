import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_AdvancementProgressible implements BaseWSInteraction {
    public interactionType = InteractionTypes.advancementProgressible;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.advancementProgressibleUpdated;

        let player = (await MinecraftUser.getUserByUUID(data.uuid))!;

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()

        if (data.isDone) {
            messageEmbed.setColor(EmbedColors.purple);
            messageEmbed.setTitle(`**${player.displayName}** has acquired ${data.name}`);
        } else {
            messageEmbed.setColor(EmbedColors.blue);
            messageEmbed.setTitle(
                `**${player.displayName}** has progressed in advancement ${data.name} (${data.progress})`
            );
        }

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.advancements.insertOne(buffer);
    }
}

export default WSInteractionResponder_AdvancementProgressible;
