import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";
import { WebsocketConnection } from "../WebsocketConnection.js";

class WSInteractionResponder_PlayerAttemptedLogin implements BaseWSInteraction {
    public interactionType = WebsocketOpcodes.playerAttemptedLogin;

    public async reply(buffer: MinecraftServerInteraction.playerAttemptedLogin): Promise<void> {
        const existingUser = (await Application.instance.collections.auth.findOne({
            displayName: buffer.displayName
        })) as unknown as MongoModel_MinecraftUser;

        if (existingUser == null) {
            return;
        }

        if (existingUser.uuid != null) {
            return;
        }

        // On first connection, handle IP
        Application.instance.collections.auth.replaceOne(
            { _id: existingUser._id },
            {
                uuid: buffer.uuid,
                displayName: existingUser.displayName,
                discordUser: existingUser.discordUser,
                allowedIps: [buffer.ip]
            }
        );

        for (const connection of WebsocketConnection.connections) {
            console.log("Sending auth data");
            connection.sendAuthData();
        }
    }
}

export default WSInteractionResponder_PlayerAttemptedLogin;
