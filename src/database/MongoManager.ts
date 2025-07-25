import { EnvManager } from "../EnvManager.js";
import { Logger } from "../logging/Logger.js";
import MongoDB from "mongodb";
import { Schema_AuthenticatedUser, Schema_AwaitingAuthenticationUser, Schema_IPBans, Schema_IPConfirmation, Schema_PermanentMessage } from "./Schemas.js";

export default class MongoManager {
    public static instance: MongoManager;

    public static collections: {
        authenticatedUsers: MongoDB.Collection<Schema_AuthenticatedUser>;
        awaitingAuthenticationUsers: MongoDB.Collection<Schema_AwaitingAuthenticationUser>;
        awaitingIPConfirms: MongoDB.Collection<Schema_IPConfirmation>;
        bannedIPs: MongoDB.Collection<Schema_IPBans>;
        permanentMessages: MongoDB.Collection<Schema_PermanentMessage>;
    };

    private client!: MongoDB.MongoClient;
    private db!: MongoDB.Db;

    constructor() {
        MongoManager.instance = this;
    }

    public async initialize() {
        Logger.detail("Starting Mongo Client...");
        this.client = new MongoDB.MongoClient(EnvManager.env.mongoConnectionString);
        await this.client.connect();
        this.db = this.client.db(EnvManager.env.mongoDatabaseName);
        MongoManager.collections = {
            authenticatedUsers: this.db.collection<Schema_AuthenticatedUser>("allowedMembers"),
            awaitingAuthenticationUsers: this.db.collection<Schema_AwaitingAuthenticationUser>("awaitingMembers"),
            awaitingIPConfirms: this.db.collection<Schema_IPConfirmation>("ipConfirms"),
            bannedIPs: this.db.collection<Schema_IPBans>("ipBans"),
            permanentMessages: this.db.collection<Schema_PermanentMessage>("permanentMessages")
        };
        Logger.detail("Mongo client ready!");
    }

    public static async getAccountByUUID(uuid: string, narrowToSingleUser = true): Promise<Schema_AuthenticatedUser | null> {
        const user = await MongoManager.collections.authenticatedUsers.findOne({ "accounts.minecraftUUID": uuid });

        if (narrowToSingleUser) {
            if (user == null) {
                return null;
            } else {
                user.accounts = [user.accounts.filter((a) => a.minecraftUUID == uuid)[0]];
                return user;
            }
        } else {
            return user;
        }
    }
}
