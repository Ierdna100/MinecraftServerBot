import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../dto/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_Message implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.messageSent;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.Message;

        // // prettier-ignore
        // let messageEmbed = new EmbedBuilder()
        //     .setColor(EmbedColors.red)
        //     .setTitle(`${data.sender}`);

        // await Application.instance.discordServer.publicLogChannel.send({ embeds: [messageEmbed] });
        await Application.instance.collections.messages.insertOne(data);
    }
}

export default WSInteractionResponder_Message;
