import { BaseMessageOptions, Message, MessageCreateOptions, MessageEditOptions, MessagePayload, TextChannel } from "discord.js";
import MongoManager from "../../database/MongoManager.js";
import { Logger } from "../../logging/Logger.js";
import { PermanentMessageIdentifier } from "./PermanentMessageIdentifier.js";

export abstract class PermanentMessageBase {
    private newMessageUponEdit = false;
    private messageSnowflake: string;
    private message: Message;

    constructor(
        private uniqueIdentifier: PermanentMessageIdentifier,
        private channel: TextChannel,
        updateFrequencyMillisec: number
    ) {
        this.initialize();
        setInterval(async () => this.updateMessage(await this.fetchData()), updateFrequencyMillisec);
    }

    protected abstract fetchData(): Promise<string | MessagePayload | BaseMessageOptions>;

    private async initialize() {
        const potentialMessage = await MongoManager.collections.permanentMessages.findOne({ identifier: this.uniqueIdentifier });
        if (potentialMessage == null) {
            Logger.info(`Permanent message with type '${this.uniqueIdentifier}' could not be found in database. Creating new one.`);
            this.newMessageUponEdit = true;
            return;
        }

        try {
            this.message = await this.channel.messages.fetch({ message: potentialMessage.messageId });
            this.messageSnowflake = potentialMessage.messageId;
        } catch {
            await MongoManager.collections.permanentMessages.deleteOne({ _id: potentialMessage._id });
            Logger.info(`Permanent message with type '${this.uniqueIdentifier}' could not be found in Discord's query. Creating new one.`);
            this.newMessageUponEdit = true;
            return;
        }
    }

    private async createNewMessage(contents: string | MessagePayload | BaseMessageOptions) {
        try {
            this.message = await this.channel.send(contents);
            this.messageSnowflake = this.message.id;
            this.newMessageUponEdit = false;
            MongoManager.collections.permanentMessages.insertOne({ identifier: this.uniqueIdentifier, messageId: this.messageSnowflake });
        } catch (error: any) {
            Logger.warn(`Unable to create new message with snowflake for permanent message with unique identifier '${this.uniqueIdentifier}'`);
            Logger.detail(error);
        }
    }

    public async updateMessage(contents: string | MessagePayload | BaseMessageOptions) {
        if (this.newMessageUponEdit) {
            this.createNewMessage(contents);
        } else {
            try {
                await this.message.edit(contents);
            } catch (error: any) {
                Logger.warn(
                    `Unable to edit message with snowflake '${this.messageSnowflake}' for permanent message with unique identifier '${this.uniqueIdentifier}'`
                );
                Logger.detail(error);
                await MongoManager.collections.permanentMessages.deleteOne({ messageId: this.messageSnowflake });
                this.createNewMessage(contents);
            }
        }
    }
}
