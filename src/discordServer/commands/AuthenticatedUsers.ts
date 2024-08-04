import {
    ChatInputCommandInteraction,
    CacheType,
    SlashCommandBuilder,
    CommandInteractionOptionResolver,
    MessagePayload,
    InteractionReplyOptions,
    SlashCommandSubcommandBuilder,
    SlashCommandUserOption
} from "discord.js";
import { BaseCommand, CommandOptions, CommandInteraction } from "../../dto/BaseCommand.js";
import { CRUD } from "../../dto/CRUD.js";
import { DiscordAuthentication } from "../../administration/DiscordAuthentication.js";
import { DiscordAuthData, DiscordAuthLevel } from "../../dto/DiscordAuthData.js";
import { Application } from "../../Application.js";

export abstract class CRUDCommand_AuthenticatedUsers extends BaseCommand {
    commandBuilder: Pick<SlashCommandBuilder, "name" | "description" | "toJSON"> = new SlashCommandBuilder()
        .setName("authed_users")
        .setDescription("Manage the authenticated Discord users")
        .setDefaultMemberPermissions("8")
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(CRUD.create)
                .setDescription("Adds user to the list")
                .addUserOption(new SlashCommandUserOption().setName("user").setDescription("User to add to list").setRequired(true))
        )
        .addSubcommand(
            new SlashCommandSubcommandBuilder()
                .setName(CRUD.delete)
                .setDescription("Removes user from list")
                .addUserOption(new SlashCommandUserOption().setName("user").setDescription("User to remove from list").setRequired(true))
        )
        .addSubcommand(new SlashCommandSubcommandBuilder().setName(CRUD.read).setDescription("Gets the list"));

    public async reply(interaction: CommandInteraction, executorId: string, options: CommandOptions): Promise<void> {
        if ((await DiscordAuthentication.getUserAuthLevel(executorId)) < DiscordAuthLevel.admin) {
            interaction.reply("You do not have the permissions to run this command!");
            return;
        }

        const subcommand = options.getSubcommand(true) as CRUD;

        switch (subcommand) {
            case CRUD.create:
                return await this.replyCreate(interaction, executorId, options);
            case CRUD.delete:
                return await this.replyDelete(interaction, executorId, options);
            case CRUD.read:
                return await this.replyRead(interaction, executorId, options);
        }
    }

    private async replyRead(interaction: CommandInteraction, executorId: string, options: CommandOptions): Promise<void> {
        const users = await Application.instance.collections.discordAuth.find<DiscordAuthData>({}).toArray();

        if (users.length == 0) {
            interaction.reply("No users found!");
            return;
        }

        let out = "";
        for (const user of users) {
            const discordUser = await Application.instance.discordServer.client.users.fetch(user.userId);
            out += `${discordUser.displayName} (${discordUser.id}) has auth level: ${DiscordAuthLevel[user.level]}\n`;
        }
        interaction.reply(out);
    }

    private async replyCreate(interaction: CommandInteraction, executorId: string, options: CommandOptions): Promise<void> {
        const user = options.getUser("user", true);

        const existingUser = await Application.instance.collections.discordAuth.findOne<DiscordAuthData>({ userID: user.id });
        if (existingUser != null) {
            if (existingUser.level > DiscordAuthLevel.authRequests) {
                await interaction.reply("User already exists with an authentication level greater than Authentication Request.");
                return;
            }

            await interaction.reply("User already exists with an authentication level equal to Authentication Request.");
            return;
        }

        await Application.instance.collections.discordAuth.insertOne({
            userId: user.id,
            level: DiscordAuthLevel.authRequests
        });

        await interaction.reply("Added user with Authentication Request auth level.");
    }

    private async replyDelete(interaction: CommandInteraction, executorId: string, options: CommandOptions): Promise<void> {
        const user = options.getUser("user", true);

        const existingUser = await Application.instance.collections.discordAuth.deleteOne({ userID: user.id });
        if (existingUser.deletedCount == 0) {
            await interaction.reply("No user with that User ID were registered");
            return;
        }

        await interaction.reply("Successfully deleted user!");
    }
}
