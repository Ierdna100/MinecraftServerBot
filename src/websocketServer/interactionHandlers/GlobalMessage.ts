import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";
import { DiscordClient } from "../../discordServer/DiscordClient.js";

class WSInteractionResponder_GlobalData implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.globalData;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        let data = buffer as MinecraftServerInteraction.GlobalData;

        await DiscordClient.instance.periodicMessages.infoChannel.updateMessage(data);
    }
}

export default WSInteractionResponder_GlobalData;
