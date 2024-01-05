import { CacheType, Client, Interaction, TextChannel } from "discord.js";
import { Application } from "../Application.js";
import { CommandLoader } from "./CommandLoader.js";
import { Logger } from "../logging/Logger.js";
import { disconnect } from "process";

export class DiscordClient {
    public static instance: Client;
    
    public publicLogChannel!: TextChannel;
    public infoChannel!: TextChannel

    constructor() {
        this.initializeDiscordClient();
    }

    private async initializeDiscordClient() {
        DiscordClient.instance = new Client({ intents: [] });

        CommandLoader.loadCommands();

        DiscordClient.instance.on("ready", () => this.onReady());
        DiscordClient.instance.on("interactionCreate", (interaction) => this.onInteractionCreate(interaction));
        DiscordClient.instance.on("error", (error) => this.onError(error));

        await DiscordClient.instance.login(Application.instance.env.token);

        this.publicLogChannel = (await DiscordClient.instance.channels.fetch(
            Application.instance.env.logChannelId
        )) as TextChannel;

        this.infoChannel = (await DiscordClient.instance.channels.fetch(
            Application.instance.env.infoChannelId
        )) as TextChannel;
    }

    private onReady() {
        Logger.info("Discord server started!");
        Logger.info(`Websocket ready and connected as ${DiscordClient.instance.user?.tag}`);
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
