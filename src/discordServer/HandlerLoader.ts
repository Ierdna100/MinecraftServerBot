import fs from "fs";
import path from "path";

export class HandlerLoader<T> {
    public handlers: T[] = [];

    public async loadHandlers(relativeLoadDirectory: string) {
        this.handlers = [];

        const handlerFilenames = fs.readdirSync(path.join("./build/discordServer/", relativeLoadDirectory));

        for (const handlerFilename of handlerFilenames) {
            let command: { default: new () => T } = await import(path.join("./", relativeLoadDirectory, handlerFilename));
            this.handlers.push(new command.default());
        }
    }
}
