import BackupManager from "./BackupManager.js";
import MongoManager from "./database/MongoManager.js";
import DiscordClient from "./discord/DiscordClient.js";
import { loadDatePolyfill } from "./dto/DatePolyfill.js";
import { EnvFileFields, EnvManager } from "./EnvManager.js";
import HTTPServer from "./http/HttpServer.js";
import LanguageManager from "./LanguageManager.js";
import { Logger } from "./logging/Logger.js";
import WSServer from "./wss/WSServer.js";

export class Application {
    public static instance: Application;

    public env!: EnvFileFields;

    constructor() {
        loadDatePolyfill();

        Application.instance = this;
        Logger.detail(`Current working directory: ${process.cwd()}`);

        const success = EnvManager.readAndParse();
        if (!success.success) {
            success.errors.forEach((e) => Logger.fatal(e));
            return;
        }
        Logger.initializeLevelsFromSettings();

        if (!new BackupManager().initialize()) {
            return;
        }

        Logger.info("Initializing Discord bridge");
        LanguageManager.initialize();
        new MongoManager().initialize();
        new DiscordClient().initialize();
        new WSServer().initialize();
        new HTTPServer().initialize();
    }
}

new Application();
