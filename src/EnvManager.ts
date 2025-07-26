import fs from "fs";
import { Logger } from "./logging/Logger.js";
import { ANSICodes } from "./dto/ANSICodes.js";
import path from "path";

const envFilepath = "./env/.env.json";

export class EnvManager {
    public static env: EnvFileFields;

    public static readAndParse(): { success: true } | { success: false; errors: string[] } {
        const errors: string[] = [];

        Logger.detail(`Using env file at ${path.resolve(envFilepath)}`);
        if (!fs.existsSync(envFilepath)) {
            fs.writeFileSync(envFilepath, JSON.stringify(new EnvFileFields(), null, "\t"));
            errors.push("Environnement file does not exist! Automatically created file, please fill it in!");
            return { success: false, errors: errors };
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
                    errors.push(`Environnement variable with key '${key}' was expected to be a number, but parsing it returned NaN!`);
                    continue;
                }
                (envFileFields[key as keyof EnvFileFields] as number) = value;
            } else if (typeof envFileFields[key as keyof EnvFileFields] == "string") {
                const value = (envFileJSON[key] as string).trim();
                if (value == "") {
                    errors.push(`Environnement variable with key '${key}' was expected to be a string, but it is empty!`);
                    continue;
                }
                (envFileFields[key as keyof EnvFileFields] as string) = value;
            } else if (typeof envFileFields[key as keyof EnvFileFields] == "boolean") {
                const value = envFileJSON[key];
                if (typeof value != "boolean") {
                    errors.push(`Environnement variable with key '${key}' was expected to be a string[], but it is ${typeof value}!`);
                    continue;
                }

                (envFileFields[key as keyof EnvFileFields] as boolean) = value;
            } else if (Array.isArray(envFileFields[key as keyof EnvFileFields])) {
                const firstElement = (envFileFields[key as keyof EnvFileFields] as Array<any>)[0];
                if (typeof firstElement == "string") {
                    const value = envFileJSON[key];
                    if (!Array.isArray(value)) {
                        errors.push(`Environnement variable with key '${key}' was expected to be a string[], but it does not pass the array check!`);
                        continue;
                    }

                    if (value.filter((e) => typeof e != "string").length != 0) {
                        errors.push(`Environnement variable with key '${key}' was expected to be a string[], but some elements are not strings!`);
                        continue;
                    }

                    (envFileFields[key as keyof EnvFileFields] as string[]) = value;
                }
            }

            remainingFieldKeys.splice(remainingFieldKeys.indexOf(key), 1);
        }

        if (remainingFieldKeys.length != 0) {
            errors.push(`Environnement variable with key '${remainingFieldKeys[0]}' not set to a value! Please fill out the .env file!`);
        }

        if (errors.length != 0) {
            return { success: false, errors: errors };
        }

        EnvManager.env = envFileFields;
        return { success: true };
    }
}

export class EnvFileFields {
    mongoConnectionString = "mongodb://localhost:27017";
    mongoDatabaseName = "minecraft";

    token = "";
    clientId = "";

    logDetails = true;
    logTimestamps = true;

    httpPort = 8000;

    websocketPort = 7500;
    websocketPassword = crypto.randomUUID();

    updateFreqServerInfoMillisec = 15_000;
    updateFreqPlayerList = 15_000;

    publicBroadcastChannelId = "";
    privateBroadcastChannelId = "";
    authenticationRequestsChannelId = "";
    serverInfoChannelId = "";

    authenticationRequestsPingRoleId = "";
    autoAuthenticateRoleId = "";

    backupTimeHours = 2400;

    serverInfoEmbedTitle = "";
    serverInfoEmbedIp = "";
    serverInfoMoTDList = [""];

    constructor() {}
}
