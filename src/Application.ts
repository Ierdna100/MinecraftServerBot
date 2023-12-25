import { Client } from "discord.js";
import { EnvManager, MinecraftServerBotEnvStructure } from "./dto/EnvManager.js";
import { Express } from "express";
import { configDotenv } from "dotenv";
import { HttpServer } from "./httpServer/httpServer.js";

export class Application {
    public static instance: Application;
    public env: MinecraftServerBotEnvStructure;
    // public discordServer: DiscordServer;
    public httpServer: HttpServer;
    
    constructor() {
        configDotenv();

        this.env = {
            token: EnvManager.isEnvFieldValid(process.env.TOKEN),
            clientId: EnvManager.isEnvFieldValid(process.env.CLIENT_ID),
            httpServerPort: parseInt(EnvManager.isEnvFieldValid(process.env.PORT))
        };
        
        this.httpServer = new HttpServer();
        // this.discordServer = new DiscordServer();

        Application.instance = this;
    }
}

new Application();
