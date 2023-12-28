import { User } from "discord.js";
import { Application } from "../Application.js";
import { MongoModel_MinecraftUser } from "./MongoModels.js";
import { DiscordClient } from "../discordServer/DiscordClient.js";

export class MinecraftUser {
    public uuid: string | undefined;
    public displayName: string | undefined;
    public discordUser: User;
    public allowedIps: string[] = [];

    constructor(discordUser: User, displayName?: string, uuid?: string) {
        this.discordUser = discordUser;
        this.displayName = displayName || undefined;
        this.uuid = uuid || undefined;
    }

    public static async getUserByUUID(uuidToMatch: string): Promise<MinecraftUser | null> {
        const rawInput = (await Application.instance.collections.auth.findOne({
            uuid: uuidToMatch.toString()
        })) as unknown as MongoModel_MinecraftUser;

        let newUser = new MinecraftUser(await DiscordClient.instance.users.fetch(rawInput.discordUser));
        newUser.allowedIps = rawInput.allowedIps;
        newUser.displayName = rawInput.displayName;
        newUser.uuid = rawInput.uuid;

        return newUser;
    }
}
