import { Message, TextChannel } from "discord.js";
import { MinecraftServerInteraction } from "../dto/HTTPEndpointsStruct.js";
import { DiscordClient } from "./DiscordClient.js";
import { MinecraftUser } from "../dto/MinecraftUser.js";
import { PeriodicMessageType } from "../dto/PeriodicMessageReference.js";

export abstract class PeriodicMessageBase {
    protected abstract messageType: PeriodicMessageType;
    protected messageToUpdate: Message | undefined;
    public playersOnline: MinecraftUser[] = [];

    public channel: TextChannel | undefined;

    public async initializePeriodicMessage(channelId: string) {
        var channel = await DiscordClient.instance.client.channels.fetch(channelId);

        if (channel == null) {
            throw new Error("Channel provided for periodic message was null!");
        }

        if (!channel.isTextBased()) {
            throw new Error("Channel provided for periodic message was not text based!");
        }

        this.channel = channel as TextChannel;

        this.fetchNewestData();
    }

    public abstract fetchNewestData(): Promise<void>;

    public abstract updateMessage(data: MinecraftServerInteraction.GlobalData): Promise<void>;
}
