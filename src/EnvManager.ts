import fs from "fs";
import { Logger } from "./logging/Logger.js";
import { ANSICodes } from "./dto/ANSICodes.js";

const envFilepath = "./.env.json";

export class EnvManager {
    public static env: EnvFileFields;

    public static readAndParse() {
        if (!fs.existsSync(envFilepath)) {
            fs.writeFileSync(envFilepath, JSON.stringify(new EnvFileFields(), null, "\t"));
            throw new Error("Environnement file does not exist! Automatically created file, please fill it in!");
        }

        const envFileJSON = JSON.parse(fs.readFileSync(envFilepath).toString());

        let envFileFields = new EnvFileFields();

        const remainingFieldKeys: string[] = [];
        for (const key in envFileFields) {
            remainingFieldKeys.push(key);
        }

        for (const key in envFileJSON) {
            if (!remainingFieldKeys.includes(key)) {
                Logger.warn(
                    `Environnement variable with key '${key}' is not required by this software, it may be leftover from a previous version. You can safely remove it.`,
                    ANSICodes.ForeBlack,
                    ANSICodes.BackYellow
                );
                continue;
            }

            if (typeof envFileFields[key as keyof EnvFileFields] == "number") {
                const value = parseFloat(envFileJSON[key]);
                if (Number.isNaN(value)) {
                    throw new Error(`Environnement variable with key '${key}' was expected to be a number, but parsing it returned NaN!`);
                }
                (envFileFields[key as keyof EnvFileFields] as number) = value;
            } else {
                (envFileFields[key as keyof EnvFileFields] as any) = envFileJSON[key];
            }

            remainingFieldKeys.splice(remainingFieldKeys.indexOf(key), 1);
        }

        if (remainingFieldKeys.length != 0) {
            throw new Error(`Environnement variable with key '${remainingFieldKeys[0]}' not set to a value! Please fill out the .env file!`);
        }

        EnvManager.env = envFileFields;
    }
}

export class EnvFileFields {
    mongoConnectionString = "mongodb://localhost:27017";
    mongoDatabaseName = "minecraft";

    token = "";
    clientId = "";

    websocketPort = 7500;

    coll_serverData = "serverData";
    coll_messages = "messages";
    coll_deaths = "deaths";
    coll_starts = "serverStarts";
    coll_stops = "serverStops";
    coll_disconnects = "playerDisconnects";
    coll_connects = "playerConnects";
    coll_advancements = "advancements";
    coll_overloads = "overloads";
    coll_allowedMembers = "allowedMembers";
    coll_awaitingMembers = "awaitingMembers";

    publicBroadcastChannelId = "";
    privateBroadcastChannelId = "";
    authenticationRequestsChannelId = "";

    authenticationRequestsPingRoleId = "";
    autoAuthenticateRoleId = "";

    backupTimeHours = 2400;

    constructor() {}
}
