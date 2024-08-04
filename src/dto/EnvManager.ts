import { configDotenv } from "dotenv";

export class EnvManager {
    public static setupMode = false;

    public static assertDefined(fieldName: string, defaultValue: string = ""): string {
        if (this.setupMode) {
            return defaultValue;
        }

        const fieldValue = process.env[fieldName];

        if (fieldValue == "" || fieldValue == undefined) {
            throw new Error(`Environnement field <${fieldName}> not set to a value! Please fill out the .env file!`);
        }

        return fieldValue;
    }

    public static config() {
        configDotenv();

        return {
            token: EnvManager.assertDefined("TOKEN"),
            clientId: EnvManager.assertDefined("CLIENT_ID"),
            WSPort: parseInt(EnvManager.assertDefined("WS_PORT")),
            mongo_connectionString: EnvManager.assertDefined("DB_CONN_STRING"),
            mongo_databaseName: EnvManager.assertDefined("DB_NAME"),
            coll_msg: EnvManager.assertDefined("COLL_NAME_MESSAGES", "messages"),
            coll_deaths: EnvManager.assertDefined("COLL_NAME_DEATHS", "deaths"),
            coll_starts: EnvManager.assertDefined("COLL_NAME_SERVER_STARTS", "server_starts"),
            coll_stops: EnvManager.assertDefined("COLL_NAME_SERVER_STOPS", "server_stops"),
            coll_leaves: EnvManager.assertDefined("COLL_NAME_PLAYER_LEAVES", "leaves"),
            coll_joins: EnvManager.assertDefined("COLL_NAME_PLAYER_JOINS", "joins"),
            coll_advancements: EnvManager.assertDefined("COLL_NAME_ADVANCEMENTS", "advancements"),
            coll_overloads: EnvManager.assertDefined("COLL_NAME_SERVER_OVERLOADS", "overloads"),
            coll_auth: EnvManager.assertDefined("COLL_NAME_ALLOWED_MEMBERS", "allowed_members"),
            coll_perf: EnvManager.assertDefined("COLL_NAME_PERFORMANCE_REPORTS", "performance_reports"),
            coll_serverData: EnvManager.assertDefined("COLL_NAME_SERVER_DATA", "server_data"),
            coll_discordAuthentication: EnvManager.assertDefined("COLL_DISCORD_AUTHENTICATION", "discord_auth"),
            WSPingFreqMs: parseInt(EnvManager.assertDefined("WS_PING_FREQ_MILLISEC", "15000")),
            WSPingTimeoutMs: parseInt(EnvManager.assertDefined("WS_PING_TIMEOUT_MS", "60000")),
            MCPingRoleId: EnvManager.assertDefined("MC_PING_ROLE_ID"),
            logChannelId: EnvManager.assertDefined("PUBLIC_LOG_CHANNEL"),
            WSGlobalDataFreqMs: parseInt(EnvManager.assertDefined("GLOBAL_DATA_FREQ_MS", "30000")),
            infoChannelId: EnvManager.assertDefined("INFO_CHANNEL"),
            worldFileLocation: EnvManager.assertDefined("WORLD_FILE_LOCATION"),
            backupFileLocation: EnvManager.assertDefined("BACKUP_FILE_LOCATION"),
            backupFreqInHrs: parseFloat(EnvManager.assertDefined("BACKUP_FREQUENCY_HOURS", "24")),
            historicalDataPollingRateMin: parseFloat(EnvManager.assertDefined("HISTORICAL_DATA_POLLING_RATE_MINUTES", "60")),
            serverIP: EnvManager.assertDefined("SERVER_IP"),
            WSPassword: EnvManager.assertDefined("WS_PASSWORD"),
            worldDownloads: EnvManager.assertDefined("COLL_WORLD_DOWNLOADS", "world_downloads")
        };
    }

    public static getTemplate(): string {
        this.setupMode = true;
        const configData = EnvManager.config();

        let out = "";
        for (const key in configData) {
            out += `${key}=${configData[key as keyof typeof configData]}\n`;
        }

        this.setupMode = false;
        return out;
    }
}
