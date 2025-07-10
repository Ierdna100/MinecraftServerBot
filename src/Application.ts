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
        try {
            EnvManager.readAndParse();
        } catch (error: any) {
            Logger.fatal(error);
            return;
        }

        Logger.info("Initializing Discord bridge");
        new MongoManager();
        new DiscordClient();
        new WSServer();
        Logger.info("Discord bridge initialized and ready!");
    }
}

new Application();
