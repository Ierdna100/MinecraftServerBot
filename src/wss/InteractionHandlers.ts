import { WebsocketData } from "./dto/MessageSchemas.js";
import { WSOpcodes } from "./dto/WSOpcodes.js";
import WSAuthenticationHandler from "./interactionHandlers/AuthenticationHandler.js";
import BaseWSInteractionHandler from "./interactionHandlers/BaseInteractionHandler.js";
import {
    WSPlayerJoinFailIPBannedHandler,
    WSPlayerJoinFailNotWhitelistedHandler,
    WSPlayerJoinFailUnregisteredIPHandler,
    WSPlayerJoinSuccessHandler
} from "./interactionHandlers/PlayerJoinHandler.js";

type WSResMap = {
    [K in WSOpcodes]: BaseWSInteractionHandler;
};

export const websocketResponses: Partial<WSResMap> = {
    [WSOpcodes.M2D_AuthenticationRequest]: new WSAuthenticationHandler(),
    [WSOpcodes.M2D_PlayerJoinSuccess]: new WSPlayerJoinSuccessHandler(),
    [WSOpcodes.M2D_PlayerJoinFail_IPBanned]: new WSPlayerJoinFailIPBannedHandler(),
    [WSOpcodes.M2D_PlayerJoinFail_NotWhitelisted]: new WSPlayerJoinFailNotWhitelistedHandler(),
    [WSOpcodes.M2D_PlayerJoinFail_UnregisteredIP]: new WSPlayerJoinFailUnregisteredIPHandler()
};
