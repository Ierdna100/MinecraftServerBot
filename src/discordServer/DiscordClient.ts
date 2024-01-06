import { CacheType, Client, Interaction, TextChannel } from "discord.js";
import { Application } from "../Application.js";
import { CommandLoader } from "./CommandLoader.js";
import { Logger } from "../logging/Logger.js";
import { PeriodicMessage_MinecraftInfo } from "./periodicMessages/MinecraftInfo.js";

export class DiscordClient {
    public static instance: DiscordClient;
    public client!: Client;

    public periodicMessages = {
        infoChannel: new PeriodicMessage_MinecraftInfo(Application.instance.env.infoChannelId)
    };

    public publicLogChannel!: TextChannel;

    constructor() {
        DiscordClient.instance = this;

        this.initializeDiscordClient();
    }

    private async initializeDiscordClient() {
        this.client = new Client({ intents: [] });

        CommandLoader.loadCommands();

        this.client.on("ready", () => this.onReady());
        this.client.on("interactionCreate", (interaction) => this.onInteractionCreate(interaction));
        this.client.on("error", (error) => this.onError(error));

        await this.client.login(Application.instance.env.token);

        this.publicLogChannel = (await this.client.channels.fetch(
            Application.instance.env.logChannelId
        )) as TextChannel;
    }

    private onReady() {
        Logger.info("Discord server started!");
        Logger.info(`Websocket ready and connected as ${this.client.user?.tag}`);
    }

    private async onInteractionCreate(interaction: Interaction<CacheType>) {
        if (!interaction.isChatInputCommand()) {
            return;
        }

        const userId = interaction.user.id;
        const options = interaction.options;

        for (const command of CommandLoader.commands) {
            if (command.commandBuilder.name == interaction.commandName) {
                await command.reply(interaction, userId, options);
                return;
            }
        }

        Logger.warn(`Command ${interaction.commandName} is not handled!`);
        await interaction.reply({ content: "`500 - Internal Server Error`" });
    }

    private async onError(error: Error) {
        Logger.error(error);
    }
}
