import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    CacheType,
    CommandInteractionOptionResolver,
    SlashCommandUserOption,
    SlashCommandStringOption,
    User
} from "discord.js";
import { BaseCommand, CommandInteraction, CommandOptions } from "../../dto/BaseCommand.js";
import { Application } from "../../Application.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";

class DiscordCommand_GeneratePlayerMetadata extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("generate_player_metadata")
        .setDescription("Generates new player metadata")

    async reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<void> {
        // if (userId != "337662083523018753") {
        //     await interaction.reply("You are not an administrator!");
        //     return;
        // }

        await interaction.reply("`501 - Not implemented`");
    }
}

export default DiscordCommand_GeneratePlayerMetadata;
