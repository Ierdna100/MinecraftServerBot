import { Application } from "../Application.js";
import { DiscordAuthData, DiscordAuthLevel } from "../dto/DiscordAuthData.js";

export class DiscordAuthentication {
    public static async getUserAuthLevel(userId: string): Promise<DiscordAuthLevel> {
        console.log(typeof userId);
        const userAuthData = (await Application.instance.collections.discordAuth.findOne({
            userId: userId
        })) as unknown as DiscordAuthData | null;

        if (userAuthData == null) {
            return DiscordAuthLevel.none;
        }

        return userAuthData.level;
    }
}
