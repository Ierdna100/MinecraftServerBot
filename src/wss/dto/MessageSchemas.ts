export interface PlayerJoin {
    name: string;
    ip: string;
    uuid: string;
}

export interface WebSocketAuthenticationRequest {
    password: string;
}
