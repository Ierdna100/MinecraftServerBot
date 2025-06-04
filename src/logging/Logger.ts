import { ANSICodes } from "../dto/ANSICodes.js";
import fs, { WriteStream } from "fs";
import { LogLevels } from "../dto/LogLevels.js";
import { ColorResolvable } from "discord.js";

export class Logger {
    private static lastFileDate: Date;
    private static logStream: WriteStream;
    public static level = LogLevels.Details | LogLevels.Info | LogLevels.Errors | LogLevels.Warnings;
    public static printTimestamp = true;

    public static detail(message: string, color = ANSICodes.Default, backgroundColor = ANSICodes.Default) {
        if ((Logger.level & LogLevels.Details) != 0) Logger.__internalLog(`[DETAIL] ${message}`, color, backgroundColor);
    }

    public static info(message: string, color = ANSICodes.Default, backgroundColor = ANSICodes.Default) {
        if ((Logger.level & LogLevels.Info) != 0) Logger.__internalLog(`[INFO] ${message}`, color, backgroundColor);
    }

    public static fatal(message: string, color = ANSICodes.ForeRed, backgroundColor = ANSICodes.Default) {
        Logger.__internalLog(`[FATAL] ${message}`, color, backgroundColor);
    }

    public static error(message: string, color = ANSICodes.ForeRed, backgroundColor = ANSICodes.Default) {
        if ((Logger.level & LogLevels.Errors) != 0) Logger.__internalLog(`[ERROR] ${message}`, color, backgroundColor);
    }

    public static warn(message: string, color = ANSICodes.ForeYellow, backgroundColor = ANSICodes.Default) {
        if ((Logger.level & LogLevels.Warnings) != 0) Logger.__internalLog(`[WARN] ${message}`, color, backgroundColor);
    }

    public static broadcastPublic(message: string, printToConsole = true, color: ColorResolvable = "Aqua") {
        if (printToConsole) {
            Logger.__internalLog(`[PUBLIC] ${message}`, ANSICodes.ForeBlack, ANSICodes.BackCyan);
        }
    }

    public static broadcastPrivate(message: string, printToConsole = true, color: ColorResolvable = "Aqua", pingModerator = false) {
        if (printToConsole) {
            Logger.__internalLog(`[PRIVATE] ${message}`, ANSICodes.ForeBlack, ANSICodes.BackMagneta);
        }
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
            "]"
        );
    }

    private static __internalLog(str: string, color: ANSICodes, backgroundColor: ANSICodes): void {
        if (Logger.printTimestamp) {
            str = `${Logger.getLogTime()} ${str}`;
        }

        let now = new Date();
        now.setHours(0, 0, 0, 0);

        if (Logger.logStream == undefined) {
            Logger.__internalCreateLogFile(now);
        } else if (now.getTime() > Logger.lastFileDate.getTime()) {
            Logger.__internalCreateLogFile(now);
        }

        let writeForegroundColor = color != ANSICodes.Default;
        let writeBackgroundColor = backgroundColor != ANSICodes.Default;

        Logger.logStream.write(str + "\n");
        if (writeForegroundColor && writeBackgroundColor) {
            console.log(color + backgroundColor + str + ANSICodes.Clear);
        } else if (writeForegroundColor) {
            console.log(color + str + ANSICodes.Clear);
        } else if (writeBackgroundColor) {
            console.log(backgroundColor + str + ANSICodes.Clear);
        } else {
            console.log(str);
        }
    }

    private static __internalCreateLogFile(timestamp: Date) {
        let year = timestamp.getFullYear().toString().padStart(2, "0");
        let month = (timestamp.getMonth() + 1).toString().padStart(2, "0"); // who the fuck programmed this to start at 0
        let day = timestamp.getDate().toString().padStart(2, "0");
        let filename = `${year}-${month}-${day}.log`;
        let filepath = `./logs/${filename}`;

        if (fs.existsSync(filepath)) {
            Logger.logStream = fs.createWriteStream(filepath, { flags: "a" });
            Logger.lastFileDate = timestamp;
            return;
        } else {
            fs.openSync(filepath, "a");
            Logger.logStream = fs.createWriteStream(filepath, { flags: "a" });
            Logger.lastFileDate = timestamp;
            return;
        }
    }
}
