import fs from "fs";
import { EnvManager } from "./EnvManager.js";
export default class Application {
    constructor() {
        if (!fs.existsSync("./logs")) {
            fs.mkdirSync("./logs");
        }
        try {
            EnvManager.readAndParse();
        } catch {} //ignore
    }
}

new Application();
