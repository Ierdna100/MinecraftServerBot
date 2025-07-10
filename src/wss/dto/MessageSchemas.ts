import { WSOpcodes } from "./WSOpcodes.js";

export type WebsocketData = PlayerJoin | WebSocketAuthenticationRequest;
export type PlayerJoin = PlayerJoin_IPBanned | PlayerJoin_NotWhitelisted | PlayerJoin_UnregisteredIP | PlayerJoin_Success;

interface StructuredWebsocketData {}

export interface PlayerJoin_UnregisteredIP extends StructuredWebsocketData {
    name: string;
    ip: string;
    uuid: string;
}

export interface PlayerJoin_IPBanned extends StructuredWebsocketData {
    name: string;
    ip: string;
    uuid: string;
}

export interface PlayerJoin_NotWhitelisted extends StructuredWebsocketData {
    name: string;
    ip: string;
    uuid: string;
}

export interface PlayerJoin_Success extends StructuredWebsocketData {
    name: string;
    ip: string;
    uuid: string;
}

export interface WebSocketAuthenticationRequest extends StructuredWebsocketData {
    password: string;
}
