import fs from "fs";
import { EnvManager } from "./EnvManager.js";
export default class Application {
    constructor() {
        if (!fs.existsSync("./logs")) {
            fs.mkdirSync("./logs");
        }
        if (!fs.existsSync("./env")) {
            fs.mkdirSync("./env");
        }
        try {
            EnvManager.readAndParse();
        } catch {} //ignore
    }
}

new Application();
