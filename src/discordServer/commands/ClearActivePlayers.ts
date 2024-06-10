import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, CommandInteractionOptionResolver } from "discord.js";
import { BaseCommand } from "../../dto/BaseCommand.js";
import { DiscordAuthLevel } from "../../dto/DiscordAuthData.js";
import { DiscordAuthentication } from "../../administration/DiscordAuthentication.js";

class DiscordCommand_ClearActivePlayerList extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("clear_active_players")
        .setDescription("Clears active players list")

    async reply(
        interaction: ChatInputCommandInteraction<CacheType>,
        userId: string,
        options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
    ): Promise<void> {
        if ((await DiscordAuthentication.getUserAuthLevel(userId)) < DiscordAuthLevel.admin) {
            await interaction.reply("You are not an administrator!");
            return;
        }

        interaction.reply("This command is deprecated.");
    }
}

export default DiscordCommand_ClearActivePlayerList;
