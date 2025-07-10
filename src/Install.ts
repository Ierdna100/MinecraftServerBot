import fs from "fs";
import { EnvManager } from "./EnvManager.js";
export default class Application {
    constructor() {
        fs.mkdirSync("./logs");
        EnvManager.readAndParse();
    }
}

new Application();
