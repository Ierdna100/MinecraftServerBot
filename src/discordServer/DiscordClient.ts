import { CacheType, Client, Interaction, TextChannel } from "discord.js";
import { Application } from "../Application.js";
import { Logger } from "../logging/Logger.js";
import { PeriodicMessage_MinecraftInfo } from "./periodicMessages/MinecraftInfo.js";
import { HandlerLoader } from "./HandlerLoader.js";
import { BaseCommand } from "../dto/BaseCommand.js";
import { BaseButton } from "../dto/BaseButton.js";

export class DiscordClient {
    public static instance: DiscordClient;
    public client!: Client;

    public commands = new HandlerLoader<BaseCommand>();
    public buttons = new HandlerLoader<BaseButton>();

    // @ts-ignore
    public periodicMessages: {
        infoChannel: PeriodicMessage_MinecraftInfo;
    } = {};

    public publicLogChannel!: TextChannel;

    constructor() {
        DiscordClient.instance = this;

        this.initializeDiscordClient();
    }

    private async initializeDiscordClient() {
        this.client = new Client({ intents: [] });

        this.commands.loadHandlers("commands");
        this.buttons.loadHandlers("buttons");

        this.client.on("ready", () => this.onReady());
        this.client.on("interactionCreate", (interaction) => this.onInteractionCreate(interaction));
        this.client.on("error", (error) => this.onError(error));

        await this.client.login(Application.instance.env.token);

        this.publicLogChannel = (await this.client.channels.fetch(Application.instance.env.logChannelId)) as TextChannel;

        this.periodicMessages.infoChannel = new PeriodicMessage_MinecraftInfo();
    }

    private onReady() {
        Logger.info("Discord server started!");
        Logger.info(`Websocket ready and connected as ${this.client.user?.tag}`);
    }

    private async onInteractionCreate(interaction: Interaction<CacheType>) {
        const userId = interaction.user.id;

        if (interaction.isChatInputCommand()) {
            const options = interaction.options;

            for (const command of this.commands.handlers) {
                if (command.commandBuilder.name == interaction.commandName) {
                    await command.reply(interaction, userId, options);
                    return;
                }
            }

            Logger.warn(`Command ${interaction.commandName} is not handled!`);
            await interaction.reply({ content: "`500 - Internal Server Error`" });
        } else if (interaction.isButton()) {
            for (const button of this.buttons.handlers) {
                if (button.builder.customId == interaction.customId) {
                    await button.handle(interaction, userId);
                    return;
                }
            }

            Logger.warn(`Button ${interaction.customId} is not handled!`);
            await interaction.reply({ content: "`500 - Internal Server Error`" });
        }
    }

    private async onError(error: Error) {
        Logger.error(error);
    }
}
