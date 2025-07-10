import fs from "fs";
import { EnvManager } from "./EnvManager.js";
import { Logger } from "./logging/Logger.js";

export default class Application {
    constructor() {
        if (!fs.existsSync("./logs")) {
            fs.mkdirSync("./logs");
        }
        if (!fs.existsSync("./env")) {
            fs.mkdirSync("./env");
        }
        const success = EnvManager.readAndParse();
        if (!success.success) {
            success.errors.forEach((e) => Logger.fatal(e));
        }
    }
}

new Application();
