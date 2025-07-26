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
    [WSOpcodes.M2D_PlayerJoinFail_UnregisteredIP]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_Message]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_Death]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_ServerStarted]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_ServerStopping]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_ServerStopped]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_PlayerLeft]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_PlayerJoin]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_Advancement]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_ServerInfo]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_SavedGame]: new WSPlayerJoinFailUnregisteredIPHandler()
};
