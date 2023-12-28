import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_PlayerJoined implements BaseWSInteraction {
    public interactionType = InteractionTypes.playerJoined;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.playerJoined;

        let player = await MinecraftUser.getUserByUUID(data.uuid);

        if (player == null) {
            const user = (await Application.instance.collections.auth.findOne({
                displayName: data.displayName
            })) as unknown as MinecraftUser;

            let newUser = new MinecraftUser(user.discordUser);
            newUser.allowedIps = user.allowedIps;
            newUser.displayName = user.displayName;
            newUser.uuid = data.uuid;

            await Application.instance.collections.auth.replaceOne({ displayName: data.displayName }, newUser);

            player = newUser;
        }

        // prettier-ignore
        let messageEmbed = new EmbedBuilder()
            .setColor(EmbedColors.green)
            .setTitle(`**${player.displayName}** joined the game.`);

        await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.joins.insertOne(buffer);
    }
}

export default WSInteractionResponder_PlayerJoined;
