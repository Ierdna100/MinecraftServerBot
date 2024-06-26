import { User } from "discord.js";
import { Application } from "../Application.js";
import { MongoModel_MinecraftUser } from "./MongoModels.js";
import { DiscordClient } from "../discordServer/DiscordClient.js";
import { Logger } from "../logging/Logger.js";

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

    public static async getUserByUUID(uuidToMatch: string): Promise<MinecraftUser | undefined> {
        // Logger.info("The bot crashes here sometimes, uuidToMatch:");
        // console.log(uuidToMatch);

        const rawInput = await Application.instance.collections.auth.findOne<MongoModel_MinecraftUser>({
            uuid: uuidToMatch.toString()
        });

        if (rawInput == null) {
            return undefined;
        }

        // console.log("rawInput:");
        // console.log(rawInput);

        let newUser = new MinecraftUser(await DiscordClient.instance.client.users.fetch(rawInput.discordUser));
        newUser.allowedIps = rawInput.allowedIps;
        newUser.displayName = rawInput.displayName;
        newUser.uuid = rawInput.uuid;

        return newUser;
    }
}
