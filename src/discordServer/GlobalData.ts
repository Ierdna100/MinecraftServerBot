import { MinecraftServerStatuses } from "../dto/MinecraftServerStatuses.js";
import { MinecraftUser } from "../dto/MinecraftUser.js";

export class GlobalData {
    public static connectedUsers: MinecraftUser[];
    public static minecraftServerStatus: MinecraftServerStatuses = MinecraftServerStatuses.offline;
    public static version: string;
    public static maxChunkDistance: string;
    public static mapSeed: string;
    public static ip: string;
}
