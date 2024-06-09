import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";
import { DiscordClient } from "../../discordServer/DiscordClient.js";

class WSInteractionResponder_PlayerLeft implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.playerLeft;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.PlayerLeft;

        let player = (await MinecraftUser.getUserByUUID(data.uuid))!;

        DiscordClient.instance.periodicMessages.infoChannel.onPlayerLeft(player.uuid!);

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.green)
            .setTitle(`**${player.displayName}** left the game: ${data.reason}`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.leaves.insertOne(buffer);
    }
}

export default WSInteractionResponder_PlayerLeft;
