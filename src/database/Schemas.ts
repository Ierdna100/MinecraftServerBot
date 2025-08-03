export type Schema_AuthenticatedUser = {
    discordUserId: string;
    accounts: {
        banned: boolean;
        minecraftUUID: string;
        minecraftName: string;
        ipAddresses: string[];
    }[];
};

export type Schema_IPBans = {
    ip: string;
};

export type Schema_AwaitingAuthenticationUser = {
    discordUserId: string;
    minecraftName: string;
};

export type Schema_IPConfirmation = {
    userToModifyMongoId: string;
    minecraftName: string;
    ipToAdd: string;
};

export type Schema_PermanentMessage = {
    identifier: number;
    messageId: string;
};

export type Schema_Administrator = {
    userId: string;
    level: number;
};
