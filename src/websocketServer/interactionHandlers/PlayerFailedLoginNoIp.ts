import { EmbedBuilder } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_PlayerFailedLoginNoIp implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.playerFailedLoginNoIp;

    public async reply(buffer: MinecraftServerInteraction.playerJoined): Promise<void> {
        const user = MinecraftUser.getUserByUUID(buffer.uuid);
    }

    // console.log("Sending auth data");
    // WebsocketConnection.connection.sendAuthData();

    private async askUserToConfirmNewIp(minecraftUser: MinecraftUser) {}
}

export default WSInteractionResponder_PlayerFailedLoginNoIp;
