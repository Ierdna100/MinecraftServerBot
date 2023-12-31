import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { InteractionTypes } from "../../dto/InteractionTypes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_PlayerFailedLoginNoIp implements BaseWSInteraction {
    public interactionType = InteractionTypes.playerFailedLoginNoIp;

    public async reply(buffer: MinecraftServerInteraction.Base): Promise<void> {
        return;
    }
}

export default WSInteractionResponder_PlayerFailedLoginNoIp;