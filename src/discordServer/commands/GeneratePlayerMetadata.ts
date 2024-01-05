import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
    CommandInteractionOptionResolver,
    SlashCommandUserOption,
    SlashCommandStringOption,
    User
} from "discord.js";
import { BaseCommand } from "../../dto/BaseCommand.js";
import { Application } from "../../Application.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";

class DiscordCommand_GeneratePlayerMetadata extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("generate_player_metadata")
        .setDescription("Generates new player metadata")

    async reply(
        interaction: ChatInputCommandInteraction<CacheType>,
        userId: string,
        options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
    ): Promise<void> {
        if (userId != "337662083523018753") {
            interaction.reply("You are not an administrator!");
            return;
        }
    }
}

export default DiscordCommand_GeneratePlayerMetadata;
