import { DiscordClient } from "./discordServer.ts/DiscordClient.js";
import { EnvManager } from "./dto/EnvManager.js";
import { configDotenv } from "dotenv";
import { HttpServer } from "./httpServer/httpServer.js";
import { Logger } from "./logging/Logger.js";
import * as MongoDB from "mongodb";

export class Application {
    public static instance: Application;

    public env;
    public logger: Logger;
    public discordServer: DiscordClient;
    public httpServer: HttpServer;

    private mongoClient: MongoDB.MongoClient;
    private mongoDatabase: MongoDB.Db;
    public collections;

    constructor() {
        configDotenv();

        this.env = {
            token: EnvManager.assertDefined(process.env.TOKEN),
            clientId: EnvManager.assertDefined(process.env.CLIENT_ID),
            httpServerPort: parseInt(EnvManager.assertDefined(process.env.PORT)),
            mongo_connectionString: EnvManager.assertDefined(process.env.DB_CONN_STRING),
            mongo_databaseName: EnvManager.assertDefined(process.env.DB_NAME),
            mongo_collectionName: EnvManager.assertDefined(process.env.GAMES_COLLECTION_NAME),
            coll_msg: EnvManager.assertDefined(process.env.COLL_NAME_MESSAGES),
            coll_deaths: EnvManager.assertDefined(process.env.COLL_NAME_DEATHS),
            coll_starts: EnvManager.assertDefined(process.env.COLL_NAME_SERVER_STARTS),
            coll_stops: EnvManager.assertDefined(process.env.COLL_NAME_SERVER_STOPS),
            coll_leaves: EnvManager.assertDefined(process.env.COLL_NAME_PLAYER_LEAVES),
            coll_joins: EnvManager.assertDefined(process.env.COLL_NAME_PLAYER_JOINS),
            coll_advancements: EnvManager.assertDefined(process.env.COLL_NAME_ADVANCEMENTS),
            coll_overloads: EnvManager.assertDefined(process.env.COLL_NAME_SERVER_OVERLOADS),
            coll_auth: EnvManager.assertDefined(process.env.COLL_NAME_ALLOWED_MEMBERS),
            coll_perf: EnvManager.assertDefined(process.env.COLL_NAME_PERFORMANCE_REPORTS),
        };

        this.logger = new Logger();
        this.httpServer = new HttpServer();
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
            performance: this.mongoDatabase.collection(this.env.coll_perf),
        };

        Application.instance = this;
    }
}

new Application();
