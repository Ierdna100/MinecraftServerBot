import { WebSocket } from "ws";
import { PlayerJoin } from "../dto/MessageSchemas.js";
import { WSOpcodes } from "../dto/WSOpcodes.js";
import BaseWSInteractionHandler from "./BaseInteractionHandler.js";

export abstract class WSPlayerJoinHandler extends BaseWSInteractionHandler<PlayerJoin> {
    public async handle(socket: WebSocket, data: PlayerJoin): Promise<void> {}
}

export class WSPlayerJoinSuccessHandler extends WSPlayerJoinHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinSuccess as const;

    public async handle(socket: WebSocket, data: PlayerJoin): Promise<void> {}
}

export class WSPlayerJoinFailIPBannedHandler extends WSPlayerJoinHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinFail_IPBanned as const;
}

export class WSPlayerJoinFailNotWhitelistedHandler extends WSPlayerJoinHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinFail_NotWhitelisted as const;
}

export class WSPlayerJoinFailUnregisteredIPHandler extends WSPlayerJoinHandler {
    public opCode = WSOpcodes.M2D_PlayerJoinFail_UnregisteredIP as const;

    public async handle(socket: WebSocket, data: PlayerJoin): Promise<void> {}
}
