import express, { Request, Response } from "express";
import { Logger } from "../logging/Logger.js";
import { EnvManager } from "../EnvManager.js";

export default class HTTPServer {
    constructor() {
        const server = express();

        server.get("/health", (req, res) => this.healthCheck(req, res));
        server.listen(EnvManager.env.httpPort, () => {
            Logger.info("Health check running!");
        });
    }

    private healthCheck(req: Request, res: Response) {}
}
