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
import { HistoricalData } from "../../historicalData/HistoricalData.js";
import { DiscordAuthentication } from "../../administration/DiscordAuthentication.js";
import { DiscordAuthLevel } from "../../dto/DiscordAuthData.js";

class DiscordCommand_GenerateServerHistoricalData extends BaseCommand {
    // prettier-ignore
    commandBuilder: Pick<SlashCommandBuilder, "name" | "toJSON" | "description"> = new SlashCommandBuilder()
        .setName("generate_historical_data")
        .setDescription("Generates new server historical data")

    async reply(
        interaction: ChatInputCommandInteraction<CacheType>,
        userId: string,
        options: Omit<CommandInteractionOptionResolver<CacheType>, "getMessage" | "getFocused">
    ): Promise<void> {
        if ((await DiscordAuthentication.getUserAuthLevel(userId)) < DiscordAuthLevel.historicalDataAccess) {
            await interaction.reply("You are not an administrator!");
            return;
        }

        await interaction.reply({ content: "**Generating response, please wait!**" });

        new HistoricalData(interaction);
        return;
    }
}

export default DiscordCommand_GenerateServerHistoricalData;
