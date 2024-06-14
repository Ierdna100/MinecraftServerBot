import { FindCursor, ObjectId, WithId } from "mongodb";

export interface MongoModel_MinecraftUser {
    _id?: ObjectId;
    uuid: string | undefined;
    displayName: string;
    discordUser: string;
    allowedIps: string[];
}

export interface MongoModel_WorldDownload {
    _id?: ObjectId;
    link: string;
    markdownTitle: string;
}
