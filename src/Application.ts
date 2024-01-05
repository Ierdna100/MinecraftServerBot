import { DiscordClient } from "./discordServer/DiscordClient.js";
import { EnvManager } from "./dto/EnvManager.js";
import { configDotenv } from "dotenv";
import { Logger } from "./logging/Logger.js";
import * as MongoDB from "mongodb";
import { Server, WebSocket } from "ws";
import { WSServer } from "./websocketServer/websocketServer.js";
import { PeriodicMessage } from "./discordServer/PeriodicMessage.js";

export class Application {
    public static instance: Application;

    public env;
    public logger: Logger;
    public discordServer: DiscordClient;
    public httpServer: WSServer;

    private mongoClient: MongoDB.MongoClient;
    private mongoDatabase: MongoDB.Db;
    public collections;

    constructor() {
        Application.instance = this;
        configDotenv();

        this.env = {
            token: EnvManager.assertDefined("TOKEN"),
            clientId: EnvManager.assertDefined("CLIENT_ID"),
            WSPort: parseInt(EnvManager.assertDefined("WS_PORT")),
            mongo_connectionString: EnvManager.assertDefined("DB_CONN_STRING"),
            mongo_databaseName: EnvManager.assertDefined("DB_NAME"),
            coll_msg: EnvManager.assertDefined("COLL_NAME_MESSAGES"),
            coll_deaths: EnvManager.assertDefined("COLL_NAME_DEATHS"),
            coll_starts: EnvManager.assertDefined("COLL_NAME_SERVER_STARTS"),
            coll_stops: EnvManager.assertDefined("COLL_NAME_SERVER_STOPS"),
            coll_leaves: EnvManager.assertDefined("COLL_NAME_PLAYER_LEAVES"),
            coll_joins: EnvManager.assertDefined("COLL_NAME_PLAYER_JOINS"),
            coll_advancements: EnvManager.assertDefined("COLL_NAME_ADVANCEMENTS"),
            coll_overloads: EnvManager.assertDefined("COLL_NAME_SERVER_OVERLOADS"),
            coll_auth: EnvManager.assertDefined("COLL_NAME_ALLOWED_MEMBERS"),
            coll_perf: EnvManager.assertDefined("COLL_NAME_PERFORMANCE_REPORTS"),
            coll_playerMetadata: EnvManager.assertDefined("COLL_NAME_PLAYER_METADATA"),
            coll_serverData: EnvManager.assertDefined("COLL_NAME_SERVER_DATA"),
            coll_discordAuthentication: EnvManager.assertDefined("COLL_DISCORD_AUTHENTICATION"),
            WSPingFreqMs: parseInt(EnvManager.assertDefined("WS_PING_FREQ_SEC")),
            WSPingTimeoutMs: parseInt(EnvManager.assertDefined("WS_PING_TIMEOUT_MS")),
            MCPingRoleId: EnvManager.assertDefined("MC_PING_ROLE_ID"),
            logChannelId: EnvManager.assertDefined("PUBLIC_LOG_CHANNEL"),
            WSGlobalDataFreqMs: parseInt(EnvManager.assertDefined("GLOBAL_DATA_FREQ_MS")),
            infoChannelId: EnvManager.assertDefined("INFO_CHANNEL")
        };

        this.logger = new Logger();
        this.httpServer = new WSServer();
        this.discordServer = new DiscordClient();
        this.mongoClient = new MongoDB.MongoClient(this.env.mongo_connectionString);
        this.mongoClient.connect();
        this.mongoDatabase = this.mongoClient.db(this.env.mongo_databaseName);
        this.collections = {
            messages: this.mongoDatabase.collection(this.env.coll_msg),
            deaths: this.mongoDatabase.collection(this.env.coll_deaths),
            starts: this.mongoDatabase.collection(this.env.coll_starts),
            stops: this.mongoDatabase.collection(this.env.coll_stops),
            leaves: this.mongoDatabase.collection(this.env.coll_leaves),
            joins: this.mongoDatabase.collection(this.env.coll_joins),
            advancements: this.mongoDatabase.collection(this.env.coll_advancements),
            overloads: this.mongoDatabase.collection(this.env.coll_overloads),
            auth: this.mongoDatabase.collection(this.env.coll_auth),
            performance: this.mongoDatabase.collection(this.env.coll_perf)
        };

        new PeriodicMessage();
    }
}

new Application();
