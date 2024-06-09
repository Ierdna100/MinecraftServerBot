import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_PlayerFailedLoginNoIp implements BaseWSInteraction {
    public static IpsAwaitingConfirmation: Map<string, string> = new Map<string, string>();

    public interactionType = WebsocketOpcodes.playerFailedLoginNoIp;

    public async reply(buffer: MinecraftServerInteraction.PlayerJoined): Promise<void> {
        const user = await MinecraftUser.getUserByUUID(buffer.uuid);

        if (user == null) {
            return;
        }

        this.askUserToConfirmNewIp(user, buffer.ip);
    }

    private async askUserToConfirmNewIp(minecraftUser: MinecraftUser, newIp: string) {
        await minecraftUser.discordUser.send(
            `A Minecraft account linked to your Discord user recently attempted to connect with IP \`${newIp}\`. ` +
                `If this wasn't you, please report it. If this was you, confirm by typing command "/confirm" here.`
        );

        WSInteractionResponder_PlayerFailedLoginNoIp.IpsAwaitingConfirmation.set(minecraftUser.discordUser.id, newIp);
    }
}

export default WSInteractionResponder_PlayerFailedLoginNoIp;
