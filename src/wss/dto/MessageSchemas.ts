import { WSOpcodes } from "./WSOpcodes.js";

export type WebsocketData = PlayerJoin | WebSocketAuthenticationRequest;

interface StructuredWebsocketData {
    opcode: WSOpcodes;
    data: unknown;
}

export interface PlayerJoin extends StructuredWebsocketData {
    opcode:
        | WSOpcodes.M2D_PlayerJoinFail_UnregisteredIP
        | WSOpcodes.M2D_PlayerJoinFail_IPBanned
        | WSOpcodes.M2D_PlayerJoinFail_NotWhitelisted
        | WSOpcodes.M2D_PlayerJoinSuccess;
    data: {
        name: string;
        ip: string;
        uuid: string;
    };
}

export interface WebSocketAuthenticationRequest extends StructuredWebsocketData {
    opcode: WSOpcodes.M2D_AuthenticationRequest;
    data: { password: string };
}
