export interface DiscordAuthData {
    userId: string;
    level: DiscordAuthLevel;
}

export enum DiscordAuthLevel {
    admin = 4,
    historicalDataAccess = 3,
    authRequests = 1,
    none = 0
}
