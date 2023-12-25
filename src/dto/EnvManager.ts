export interface MinecraftServerBotEnvStructure {
    token: string;
    clientId: string;
    httpServerPort: number
}

export class EnvManager {
    public static isEnvFieldValid(fieldValue: string | undefined): string {
        if (fieldValue == "" || fieldValue == undefined) {
            throw new Error(`Environnement field not set to a value! Please fill out the .env file!`)
        }

        return fieldValue;
    }
}
