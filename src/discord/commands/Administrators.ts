import { SlashCommandBuilder, InteractionReplyOptions, SlashCommandSubcommandBuilder, SlashCommandUserOption, MessageFlags } from "discord.js";
import SlashCommandBase, { CommandInteraction, CommandOptions } from "./SlashCommandBase.js";
import MongoManager from "../../database/MongoManager.js";
import { AdminLevels } from "../../dto/AdminLevels.js";
import { Logger } from "../../logging/Logger.js";

export class SlashCommand_Administrators extends SlashCommandBase {
    // prettier-ignore
    public commandBuilder = new SlashCommandBuilder()
        .setName("op")
        .setDescription("Control who has access to admin only commands.")
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("add")
            .setDescription("Add an administrator to the administrator list.")
            .addUserOption(new SlashCommandUserOption()
                .setName("user")
                .setDescription("User to add as administrator")
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("remove")
            .setDescription("Remove an administrator from the administrator list")
            .addUserOption(new SlashCommandUserOption()
                .setName("user")
                .setDescription("User to add as administrator")
                .setRequired(true)))
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName("list")
            .setDescription("List administrators"));

    public async reply(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        if (
            (await MongoManager.collections.administrators.estimatedDocumentCount()) != 0 &&
            (await MongoManager.collections.administrators.findOne({ userId: userId })) == null
        ) {
            return { content: "You are not an administrator. You cannot execute this command.", flags: MessageFlags.Ephemeral };
        }

        const subcommand = options.getSubcommand(true) as "add" | "remove" | "list";
        switch (subcommand) {
            case "add":
                return this.replyAdd(interaction, userId, options);
            case "remove":
                return this.replyRemove(interaction, userId, options);
            case "list":
                return this.replyList(interaction, userId, options);
        }
    }

    private async replyAdd(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        const userIdToAdmin = options.getUser("user", true);
        const existingAdmin = await MongoManager.collections.administrators.findOne({ userId: userIdToAdmin.id });

        if (existingAdmin != null) {
            Logger.info(`User with ID ${userIdToAdmin} not added as an administrator: User already is and administrator.`);
            return { content: "User is already an administrator.", flags: MessageFlags.Ephemeral };
        }

        await MongoManager.collections.administrators.insertOne({ userId: userIdToAdmin.id, level: AdminLevels.Admin });
        Logger.info(`User with ID ${userIdToAdmin} added as an administrator.`);
        return {
            content: `User \`${userIdToAdmin.displayName}\` (\`${userIdToAdmin.id}\`) successfully added as an administrator.`,
            flags: MessageFlags.Ephemeral
        };
    }

    private async replyRemove(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        const userIdToAdmin = options.getUser("user", true);

        const adminCount = await MongoManager.collections.administrators.estimatedDocumentCount();
        if (adminCount < 2) {
            Logger.info(`User with ID ${userIdToAdmin} not removed from administrators: No admins will be left.`);
            return {
                content: `User \`${userIdToAdmin.displayName}\` (\`${userIdToAdmin.id}\`) cannot be added as an admin: No admins will be left!`,
                flags: MessageFlags.Ephemeral
            };
        }

        const deletedAdmin = (await MongoManager.collections.administrators.deleteOne({ userId: userIdToAdmin.id })).deletedCount == 1;

        if (!deletedAdmin) {
            Logger.info(`User with ID ${userIdToAdmin} not removed from administrators: Not an administrator.`);
            return { content: "User was not an administrator.", flags: MessageFlags.Ephemeral };
        }

        Logger.info(`User with ID ${userIdToAdmin} removed from administrators.`);
        return {
            content: `User \`${userIdToAdmin.displayName}\` (\`${userIdToAdmin.id}\`) successfully removed as an administrator.`,
            flags: MessageFlags.Ephemeral
        };
    }

    private async replyList(interaction: CommandInteraction, userId: string, options: CommandOptions): Promise<InteractionReplyOptions> {
        const admins = await MongoManager.collections.administrators.find({}, { limit: 8 }).toArray();
        const adminsNotShown = (await MongoManager.collections.administrators.estimatedDocumentCount()) - admins.length;

        const outputString: string[] = [];
        for (const admin of admins) {
            outputString.push(`\`Level: ${admin.level}, ID: ${admin.userId}, User:\` <@${admin.userId}>`);
        }
        if (adminsNotShown != 0) {
            outputString.push(`\`And ${adminsNotShown} more...\``);
        }

        return { content: `${outputString.join("\n")}`, flags: MessageFlags.Ephemeral };
    }
}
