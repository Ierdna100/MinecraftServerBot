import { Application } from "../../Application.js";
import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { BaseWSInteraction } from "../../dto/BaseWSInteraction.js";
import { WebsocketOpcodes } from "../../dto/WebsocketOpcodes.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";
import { WebsocketConnection } from "../WebsocketConnection.js";
import { WSServer } from "../websocketServer.js";

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

    
        console.log("Sending auth data");
        WebsocketConnection.connection.sendAuthData();
    }
}

export default WSInteractionResponder_PlayerAttemptedLogin;
