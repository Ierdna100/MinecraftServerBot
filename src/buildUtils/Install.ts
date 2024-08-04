import fs from "fs";
import { EnvManager } from "../dto/EnvManager.js";

class Application {
    constructor() {
        try {
            fs.mkdirSync("./cache");
        } catch (e) {}
        try {
            fs.mkdirSync("./temp");
        } catch (e) {}

        fs.writeFileSync("./.env", EnvManager.getTemplate());
    }
}

new Application();
