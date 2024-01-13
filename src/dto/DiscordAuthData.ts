export interface DiscordAuthData {
    userId: string;
    level: DiscordAuthLevel;
}

export enum DiscordAuthLevel {
    admin = 4,
    historicalDataAccess = 1,
    none = 0
}
