import { Channel, EmbedBuilder, Message, TextChannel } from "discord.js";
import { Logger } from "../logging/Logger.js";
import { WebsocketConnection } from "../websocketServer/WebsocketConnection.js";
import { WebsocketOpcodes } from "../dto/WebsocketOpcodes.js";
import { MinecraftServerInteraction } from "../dto/HTTPEndpointsStruct.js";
import { EmbedColors } from "./EmbedColors.js";
import { DiscordClient } from "./DiscordClient.js";
import { Application } from "../Application.js";
import { MinecraftUser } from "../dto/MinecraftUser.js";

export abstract class PeriodicMessageBase {
    protected messageToUpdate: Message | undefined;
    public playersOnline: MinecraftUser[] = [];

    public channel: TextChannel | undefined;

    constructor(channelId: string) {
        this.ctor(channelId);
    }

    private async ctor(channelId: string) {
        var channel = await DiscordClient.instance.client.channels.fetch(channelId);

        if (channel == null) {
            throw new Error("Channel provided for periodic message was null!");
        }

        if (!channel.isTextBased()) {
            throw new Error("Channel provided for periodic message was not text based!");
        }

        this.channel = channel as TextChannel;
    }

    public async initializePeriodicMessage() {
        this.fetchNewestData();
    }

    public abstract fetchNewestData(): Promise<void>;

    public abstract updateMessage(data: MinecraftServerInteraction.GlobalData): Promise<void>;
}
