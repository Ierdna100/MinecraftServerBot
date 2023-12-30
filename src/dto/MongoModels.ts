import { ObjectId } from "mongodb";

export interface MongoModel_MinecraftUser {
    _id?: ObjectId;
    uuid: string | undefined;
    displayName: string;
    discordUser: string;
    allowedIps: string[];
}
