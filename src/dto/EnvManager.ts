import { configDotenv } from "dotenv";

export class EnvManager {
    public static assertDefined(fieldName: string, failSilenty = false): string {
        const fieldValue = process.env[fieldName];

        if (fieldValue == "" || fieldValue == undefined) {
            throw new Error(`Environnement field <${fieldName}> not set to a value! Please fill out the .env file!`);
        }

        return fieldValue;
    }

    public static config(): EnvFileFields {
        configDotenv();

        return {
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
            // coll_serverData: EnvManager.assertDefined("COLL_NAME_SERVER_DATA"),
            // coll_discordAuthentication: EnvManager.assertDefined("COLL_DISCORD_AUTHENTICATION"),
            WSPingFreqMs: parseInt(EnvManager.assertDefined("WS_PING_FREQ_SEC")),
            WSPingTimeoutMs: parseInt(EnvManager.assertDefined("WS_PING_TIMEOUT_MS")),
            MCPingRoleId: EnvManager.assertDefined("MC_PING_ROLE_ID"),
            logChannelId: EnvManager.assertDefined("PUBLIC_LOG_CHANNEL"),
            WSGlobalDataFreqMs: parseInt(EnvManager.assertDefined("GLOBAL_DATA_FREQ_MS")),
            infoChannelId: EnvManager.assertDefined("INFO_CHANNEL"),
            worldFileLocation: EnvManager.assertDefined("WORLD_FILE_LOCATION"),
            backupFileLocation: EnvManager.assertDefined("BACKUP_FILE_LOCATION"),
            backupFreqInHrs: parseFloat(EnvManager.assertDefined("BACKUP_FREQUENCY_HOURS")),
            historicalDataPollingRateMin: parseFloat(EnvManager.assertDefined("HISTORICAL_DATA_POLLING_RATE_MINUTES"))
        };
    }

    public static envTemplate =
        "TOKEN=\n" +
        "CLIENT_ID=\n" +
        "WS_PORT=5000\n" +
        "DB_CONN_STRING=\n" +
        "DB_NAME=\n" +
        "COLL_NAME_MESSAGES=messages\n" +
        "COLL_NAME_DEATHS=deaths\n" +
        "COLL_NAME_SERVER_STARTS=starts\n" +
        "COLL_NAME_SERVER_STOPS=stops\n" +
        "COLL_NAME_PLAYER_LEAVES=playerLeaves\n" +
        "COLL_NAME_PLAYER_JOINS=playerJoins\n" +
        "COLL_NAME_ADVANCEMENTS=advancements\n" +
        "COLL_NAME_SERVER_OVERLOADS=serverOverloads\n" +
        "COLL_NAME_ALLOWED_MEMBERS=authentication\n" +
        "COLL_NAME_PERFORMANCE_REPORTS=performance\n" +
        "COLL_SERVER_DATA=serverData\n" +
        "PUBLIC_LOG_CHANNEL=\n" +
        "INFO_CHANNEL=\n" +
        "WS_PING_FREQ_SEC=15000\n" +
        "WS_PING_TIMEOUT_MS=500\n" +
        "MC_PING_ROLE_ID=\n" +
        "GLOBAL_DATA_FREQ_MS=30000\n" +
        "WORLD_FILE_LOCATION=\n" +
        "BACKUP_FILE_LOCATION=\n" +
        "BACKUP_FREQUENCY_HOURS=12\n" +
        "HISTORICAL_DATA_POLLING_RATE_MINUTES=60";
}

export interface EnvFileFields {
    token: string;
    clientId: string;
    WSPort: number;
    mongo_connectionString: string;
    mongo_databaseName: string;
    coll_msg: string;
    coll_deaths: string;
    coll_starts: string;
    coll_stops: string;
    coll_leaves: string;
    coll_joins: string;
    coll_advancements: string;
    coll_overloads: string;
    coll_auth: string;
    coll_perf: string;
    WSPingFreqMs: number;
    WSPingTimeoutMs: number;
    MCPingRoleId: string;
    logChannelId: string;
    WSGlobalDataFreqMs: number;
    infoChannelId: string;
    worldFileLocation: string;
    backupFileLocation: string;
    backupFreqInHrs: number;
    historicalDataPollingRateMin: number;
}
