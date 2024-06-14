import { DiscordClient } from "./discordServer/DiscordClient.js";
import { EnvFileFields, EnvManager } from "./dto/EnvManager.js";
import { Logger } from "./logging/Logger.js";
import * as MongoDB from "mongodb";
import { WSServer } from "./websocketServer/websocketServer.js";
import { BackupManager } from "./backupSystem/BackupManager.js";

export class Application {
    public static instance: Application;

    public env: EnvFileFields;
    public logger: Logger;
    public discordServer: DiscordClient;
    public WSServer: WSServer;
    public backupManager: BackupManager;

    private mongoClient: MongoDB.MongoClient;
    private mongoDatabase: MongoDB.Db;
    public collections;

    public startTime = new Date();

    constructor() {
        Application.instance = this;

        this.env = EnvManager.config();

        this.logger = new Logger();
        this.mongoClient = new MongoDB.MongoClient(this.env.mongo_connectionString);
        this.mongoClient.connect();
        this.mongoDatabase = this.mongoClient.db(this.env.mongo_databaseName);
        this.backupManager = new BackupManager(this.env.backupFileLocation, this.env.worldFileLocation, this.env.backupFreqInHrs);
        this.collections = {
            serverData: this.mongoDatabase.collection(this.env.coll_serverData),
            discordAuth: this.mongoDatabase.collection(this.env.coll_discordAuthentication),
            messages: this.mongoDatabase.collection(this.env.coll_msg),
            deaths: this.mongoDatabase.collection(this.env.coll_deaths),
            starts: this.mongoDatabase.collection(this.env.coll_starts),
            stops: this.mongoDatabase.collection(this.env.coll_stops),
            leaves: this.mongoDatabase.collection(this.env.coll_leaves),
            joins: this.mongoDatabase.collection(this.env.coll_joins),
            advancements: this.mongoDatabase.collection(this.env.coll_advancements),
            overloads: this.mongoDatabase.collection(this.env.coll_overloads),
            auth: this.mongoDatabase.collection(this.env.coll_auth),
            performance: this.mongoDatabase.collection(this.env.coll_perf),
            worldDownloads: this.mongoDatabase.collection(this.env.worldDownloads)
        };
        this.WSServer = new WSServer();
        this.discordServer = new DiscordClient();
    }
}

new Application();
