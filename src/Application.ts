import MongoManager from "./database/MongoManager.js";
import DiscordClient from "./discord/DiscordClient.js";
import { ANSICodes } from "./dto/ANSICodes.js";
import { EnvFileFields, EnvManager } from "./EnvManager.js";
import { Logger } from "./logging/Logger.js";
import WSServer from "./wss/WSServer.js";

export class Application {
    public static instance: Application;

    public env!: EnvFileFields;

    constructor() {
        Application.instance = this;

        const success = EnvManager.readAndParse();
        if (!success.success) {
            success.errors.forEach((e) => Logger.fatal(e));
            return;
        }

        Logger.info("Initializing Discord bridge");
        new MongoManager().initialize();
        new DiscordClient().initialize();
        new WSServer().initialize();
    }
}

new Application();
