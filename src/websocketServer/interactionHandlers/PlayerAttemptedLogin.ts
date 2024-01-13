import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";
import { WebsocketConnection } from "../WebsocketConnection.js";
import { WSServer } from "../websocketServer.js";
import { MinecraftUser } from "../../dto/MinecraftUser.js";

class WSInteractionResponder_PlayerAttemptedLogin implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.playerAttemptedLogin;

    public async reply(data: MinecraftServerInteraction.playerAttemptedLogin): Promise<void> {
        const existingUser = (await Application.instance.collections.auth.findOne({
            displayName: data.displayName
        })) as unknown as MongoModel_MinecraftUser;

        if (existingUser == null) {
            return;
        }

        if (existingUser.uuid != null) {
            return;
        }

        // On first connection, handle UUID
        await Application.instance.collections.auth.replaceOne(
            { _id: existingUser._id },
            {
                uuid: data.uuid,
                displayName: existingUser.displayName,
                discordUser: existingUser.discordUser,
                allowedIps: []
            }
        );
        return;
    }
}

export default WSInteractionResponder_PlayerAttemptedLogin;
