import { DiscordServer } from "./discordServer.ts/DiscordServer.js";
import { EnvManager } from "./dto/EnvManager.js";
import { configDotenv } from "dotenv";
import { HttpServer } from "./httpServer/httpServer.js";
import { Logger } from "./logging/Logger.js";
import * as MongoDB from "mongodb";

export class Application {
    public static instance: Application;

    public env;
    public logger: Logger;
    public discordServer: DiscordServer;
    public httpServer: HttpServer;

    private mongoClient: MongoDB.MongoClient;
    private mongoDatabase: MongoDB.Db;
    public collections: { games: MongoDB.Collection };

    constructor() {
        configDotenv();

        this.env = {
            token: EnvManager.assertEnvFieldNotUndefined(process.env.TOKEN),
            clientId: EnvManager.assertEnvFieldNotUndefined(process.env.CLIENT_ID),
            httpServerPort: parseInt(EnvManager.assertEnvFieldNotUndefined(process.env.PORT)),
            mongo_connectionString: EnvManager.assertEnvFieldNotUndefined(process.env.DB_CONN_STRING),
            mongo_databaseName: EnvManager.assertEnvFieldNotUndefined(process.env.DB_NAME),
            mongo_collectionName: EnvManager.assertEnvFieldNotUndefined(process.env.GAMES_COLLECTION_NAME)
        };

        this.logger = new Logger();
        this.httpServer = new HttpServer();
        this.discordServer = new DiscordServer();
        this.mongoClient = new MongoDB.MongoClient(this.env.mongo_connectionString);
        this.mongoClient.connect();
        this.mongoDatabase = this.mongoClient.db(this.env.mongo_databaseName);
        this.collections = {
            games: this.mongoDatabase.collection(this.env.mongo_collectionName)
        };

        Application.instance = this;
    }
}

new Application();
