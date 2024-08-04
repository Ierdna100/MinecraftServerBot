import {
    SlashCommandBuilder,
    CacheType,
    ChatInputCommandInteraction,
    CommandInteractionOptionResolver,
    MessagePayload,
    InteractionReplyOptions
} from "discord.js";

export type CommandInteraction = ChatInputCommandInteraction<CacheType>;
export type CommandOptions = Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">;

abstract class BaseCommand {
    abstract commandBuilder: Pick<SlashCommandBuilder, "name" | "description" | "toJSON">;

    abstract reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<void>;
}

export { BaseCommand };
