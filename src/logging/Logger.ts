import { EmbedColors } from "../dto/EmbedColors.js";
import { ANSICodes } from "../dto/ANSICodes.js";

export class Logger {
    public static logDetail(message: string, color = ANSICodes.Default) {}

    public static log(message: string, color = ANSICodes.Default) {}

    public static logError(message: string, color = ANSICodes.ForeRed) {}

    public static logWarning(message: string, color = ANSICodes.ForeYellow) {}

    public static logToPublicDiscord(message: string, color = EmbedColors.cyan) {}

    public static logToPrivateDiscord(message: string, color = EmbedColors.cyan) {}

    public static info(data: string): void {
        console.log(Logger.getLogTime() + data);
    }

    public static error(data: Error): void {
        console.error("\u001b[31m" + Logger.getLogTime() + data.message + "\u001b[0m");
    }

    public static warn(data: string): void {
        console.warn("\u001b[33m" + Logger.getLogTime() + data);
    }

    private static getLogTime(): string {
        const date = new Date();
        return (
            "[" +
            date.getHours().toString().padStart(2, "0") +
            ":" +
            date.getMinutes().toString().padStart(2, "0") +
            ":" +
            date.getSeconds().toString().padStart(2, "0") +
            "." +
            date.getMilliseconds().toString().padStart(3, "0") +
            "] "
        );
    }
}
