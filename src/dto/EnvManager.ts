export class EnvManager {
    public static assertDefined(fieldName: string): string {
        const fieldValue = process.env[fieldName];

        if (fieldValue == "" || fieldValue == undefined) {
            throw new Error(`Environnement field <${fieldName}> not set to a value! Please fill out the .env file!`);
        }

        return fieldValue;
    }
}
