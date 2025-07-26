import { WSOpcodes } from "./dto/WSOpcodes.js";
import { WSAdvancementHandler } from "./interactionHandlers/AdvancementHandler.js";
import WSAuthenticationHandler from "./interactionHandlers/AuthenticationHandler.js";
import BaseWSInteractionHandler from "./interactionHandlers/BaseInteractionHandler.js";
import WSDeathHandler from "./interactionHandlers/DeathHandler.js";
import WSMessageHandler from "./interactionHandlers/MessageHandler.js";
import {
    WSPlayerJoinFailIPBannedHandler,
    WSPlayerJoinFailNotWhitelistedHandler,
    WSPlayerJoinFailUnregisteredIPHandler,
    WSPlayerJoinHandler,
    WSPlayerJoinSuccessHandler
} from "./interactionHandlers/PlayerJoinHandler.js";
import WSPlayerLeftHandler from "./interactionHandlers/PlayerLeftHandler.js";
import { WSServerInfoHandler } from "./interactionHandlers/ServerInfoHandler.js";
import { WSGameSavedHandler, WSServerStartedHandler, WSServerStoppedHandler, WSServerStoppingHandler } from "./interactionHandlers/ServerLifecycleHandler.js";

type WSResMap = {
    [K in WSOpcodes]: BaseWSInteractionHandler;
};

export const websocketResponses: Partial<WSResMap> = {
    [WSOpcodes.M2D_AuthenticationRequest]: new WSAuthenticationHandler(),
    [WSOpcodes.M2D_PlayerJoinSuccess]: new WSPlayerJoinSuccessHandler(),
    [WSOpcodes.M2D_PlayerJoinFail_IPBanned]: new WSPlayerJoinFailIPBannedHandler(),
    [WSOpcodes.M2D_PlayerJoinFail_NotWhitelisted]: new WSPlayerJoinFailNotWhitelistedHandler(),
    [WSOpcodes.M2D_PlayerJoinFail_UnregisteredIP]: new WSPlayerJoinFailUnregisteredIPHandler(),
    [WSOpcodes.M2D_Message]: new WSMessageHandler(),
    [WSOpcodes.M2D_Death]: new WSDeathHandler(),
    [WSOpcodes.M2D_ServerStarted]: new WSServerStartedHandler(),
    [WSOpcodes.M2D_ServerStopping]: new WSServerStoppingHandler(),
    [WSOpcodes.M2D_ServerStopped]: new WSServerStoppedHandler(),
    [WSOpcodes.M2D_PlayerLeft]: new WSPlayerLeftHandler(),
    [WSOpcodes.M2D_PlayerJoin]: new WSPlayerJoinHandler(),
    [WSOpcodes.M2D_Advancement]: new WSAdvancementHandler(),
    [WSOpcodes.M2D_ServerInfo]: new WSServerInfoHandler(),
    [WSOpcodes.M2D_SavedGame]: new WSGameSavedHandler()
};
