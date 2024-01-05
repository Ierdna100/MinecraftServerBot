import { Channel, Message, TextChannel } from "discord.js";
import { Logger } from "../logging/Logger.js";

export class PeriodicMessage {
    public static instance: PeriodicMessage;

    private channel: TextChannel;
    private messageToUpdate: Message | undefined = undefined;

    constructor(channel: Channel) {
        PeriodicMessage.instance = this;

        if (!channel.isTextBased()) {
            throw new Error("Provided channel for continously update message isn't text based!");
            return;
        }

        channel = channel as TextChannel;
        this.channel = channel;

        this.updateMessage();
    }

    public async updateMessage() {
        if (this.messageToUpdate == undefined) {
            // this.messageToUpdate = await this.channel.send();
        }
    }
}
