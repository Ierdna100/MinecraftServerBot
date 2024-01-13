import { EmbedBuilder, User } from "discord.js";
import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { EmbedColors } from "../../discordServer/EmbedColors.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_PlayerFailedLoginNoIp implements BaseWSInteraction {
    public static IpsAwaitingConfirmation: Map<string, string> = new Map<string, string>();

    public interactionType = WebsocketOpcodes.playerFailedLoginNoIp;

    public async reply(buffer: MinecraftServerInteraction.playerJoined): Promise<void> {
        const user = await MinecraftUser.getUserByUUID(buffer.uuid);

        if (user == null) {
            return;
        }

        this.askUserToConfirmNewIp(user, buffer.ip);
    }

    // console.log("Sending auth data");
    // WebsocketConnection.connection.sendAuthData();

    private async askUserToConfirmNewIp(minecraftUser: MinecraftUser, newIp: string) {
        await minecraftUser.discordUser.send(
            `A Minecraft account linked to your Discord user recently attempted to connect with IP \`${newIp}\`. ` +
                `If this wasn't you, please report it. If this was you, confirm by typing command "/confirm" here.`
        );

        WSInteractionResponder_PlayerFailedLoginNoIp.IpsAwaitingConfirmation.set(minecraftUser.discordUser.id, newIp);
    }
}

export default WSInteractionResponder_PlayerFailedLoginNoIp;
