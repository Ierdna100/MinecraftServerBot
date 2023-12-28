import { ObjectId } from "mongodb";

export interface MongoModel_MinecraftUser {
    _id: ObjectId;
    uuid: string | undefined;
    displayName: string | undefined;
    discordUser: string;
    allowedIps: string[];
}
