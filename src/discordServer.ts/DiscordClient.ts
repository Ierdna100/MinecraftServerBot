import { Client } from "discord.js";

export class DiscordClient {
    public static instance: Client;

    constructor() {
        DiscordClient.instance = new Client({ intents: [] });
    }
}
