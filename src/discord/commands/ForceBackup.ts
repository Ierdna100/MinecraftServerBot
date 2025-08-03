import { SlashCommandBuilder, InteractionReplyOptions, SlashCommandBooleanOption, MessageFlags } from "discord.js";
import SlashCommandBase, { CommandInteraction, CommandOptions } from "./SlashCommandBase.js";
import MongoManager from "../../database/MongoManager.js";
import BackupManager from "../../BackupManager.js";

export class SlashCommand_ForceBackup extends SlashCommandBase {
    // prettier-ignore
    public commandBuilder = new SlashCommandBuilder()
        .setName("force_backup")
        .setDescription("Force backup upon the next game save.")
        .addBooleanOption(new SlashCommandBooleanOption()
            .setName("immediate")
            .setDescription("If the backup system should NOT wait for a game save. Use if the game is paused and won't save."))
        .addBooleanOption(new SlashCommandBooleanOption()
            .setName("override_daily_backup_limit")
            .setDescription("If the backup system should backup even if a backup was made today."));

    public async reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        if ((await MongoManager.collections.administrators.findOne({ userId: userId })) == null) {
            return { content: "You are not an administrator. You cannot execute this command.", flags: MessageFlags.Ephemeral };
        }

        const immediate = options.getBoolean("immediate") ?? false;
        const overrideDailyBackupLimit = options.getBoolean("override_daily_backup_limit") ?? false;

        return { content: await BackupManager.instance.forceBackup(immediate, overrideDailyBackupLimit) };
    }
}
