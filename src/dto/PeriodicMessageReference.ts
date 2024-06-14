export interface PeriodicMessageReference {
    messageId: string;
    type: PeriodicMessageType;
}

// This is temporarily used to serve any kind of global data that the DB handles, should probably fix this
export enum PeriodicMessageType {
    minecraftInfo,
    backupTime
}
