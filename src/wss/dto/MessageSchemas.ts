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

export interface Message extends StructuredWebsocketData {
    message: string;
    uuid: string | null;
}

export interface Death extends StructuredWebsocketData {
    killedUuid: string;
    messageKey: string;
    killerType: string | null;
    killerUuid: string | null;
    itemType: string | null;
    itemName: string | null;
}

export interface Empty {}

export interface PlayerLeft extends StructuredWebsocketData {
    uuid: string;
    reason: string;
}

export interface PlayerJoined extends StructuredWebsocketData {
    name: string;
    ip: string;
    uuid: string;
    x: number;
    y: number;
    z: number;
    dimension: string;
}

export interface Advancement extends StructuredWebsocketData {
    uuid: string;
    advancementName: string;
    isBoolean: boolean;
    isDone: boolean;
    obtainedRequirements: number;
    requiredRequirements: number;
}

export interface ServerInfo extends StructuredWebsocketData {
    seed: string;
    maxPlayers: number;
    currentPlayerCount: number;
    version: string;
    MoTD: string;
    currentPlayers: string[];
    uptimeSeconds: number;
    serverTimeOfDay: number;
    cumulativeServerTime: number;
}

export interface GameSaved extends StructuredWebsocketData {
    flush: boolean;
    force: boolean;
}

export interface WebSocketAuthenticationRequest extends StructuredWebsocketData {
    password: string;
}
