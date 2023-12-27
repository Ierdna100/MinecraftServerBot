export class EnvManager {
    public static assertEnvFieldNotUndefined(fieldValue: string | undefined): string {
        if (fieldValue == "" || fieldValue == undefined) {
            throw new Error(`Environnement field not set to a value! Please fill out the .env file!`)
        }

        return fieldValue;
    }
}
