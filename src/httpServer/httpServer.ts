import express, { Express, Request, Response } from "express";
import { EndpointLoader } from "./EndpointLoader.js";
import { Application } from "../Application.js";

export class HttpServer {
    public static instance: HttpServer;
    public app: Express;

    constructor() {
        this.app = express();
        
        this.initializeServer();

        HttpServer.instance = this;
    }

    private async initializeServer() {
        await new EndpointLoader().loadEndpoints();

        HttpServer.instance.app.listen(Application.instance.env.httpServerPort, () => {
            console.log("READY")
        });
    }
}
