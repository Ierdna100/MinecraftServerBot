import fs from "fs";
import { BaseCommand } from "../dto/BaseCommand.js";

export class CommandLoader {
    public static commands: BaseCommand[] = [];

    public static async loadCommands() {
        CommandLoader.commands = [];

        const commandFileNames = fs.readdirSync("./build/discordServer/commands/");

        for (const commandFileName of commandFileNames) {
            let command: { default: new () => BaseCommand } = await import(`./commands/${commandFileName}`);
            CommandLoader.commands.push(new command.default());
        }
    }
}
