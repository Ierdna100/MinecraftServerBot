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

// prettier-ignore
export const websocketResponses: Record<WSOpcodes, BaseWSInteractionHandler> = [
    new WSAuthenticationHandler(),
    new WSPlayerJoinSuccessHandler(),
    new WSPlayerJoinFailIPBannedHandler(),
    new WSPlayerJoinFailNotWhitelistedHandler(),
    new WSPlayerJoinFailUnregisteredIPHandler(),
];
