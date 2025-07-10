import { ActionRow, ActionRowBuilder, ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, CacheType, InteractionUpdateOptions } from "discord.js";
import { ObjectId } from "mongodb";
import ButtonFactoryBase from "./ButtonBase.js";
import MongoManager from "../../database/MongoManager.js";
import { Logger } from "../../logging/Logger.js";

export class ButtonFactory_ConfirmIP extends ButtonFactoryBase {
    public customButtonId = "confirm-new-ip";

    // prettier-ignore
    public buttonBuilder = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setLabel("Confirm IP");

    public async onInteract(interaction: ButtonInteraction<CacheType>, relatedObjectId: ObjectId, executorId: string): Promise<InteractionUpdateOptions> {
        const request = await MongoManager.collections.awaitingIPConfirms.findOneAndDelete({ _id: relatedObjectId });
        if (request == null) {
            Logger.error(`Could not confirm IP for user with ID '${executorId}' as the request was null when it should not be.`);
            return editControlMessage(interaction, "Internal server error, please report!");
        }

        await MongoManager.collections.authenticatedUsers.updateOne(
            { _id: new ObjectId(request.userToModifyMongoId) },
            { $addToSet: { "accounts.$[account].ipAddresses": request.ipToAdd } },
            { arrayFilters: [{ "account.minecraftName": request.minecraftName }] }
        );

        return editControlMessage(interaction, "IP successfully confirmed!");
    }
}

export class ButtonFactory_DenyIP extends ButtonFactoryBase {
    public customButtonId = "deny-new-ip";

    // prettier-ignore
    public buttonBuilder = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setLabel("Deny IP and Report Incident");

    public async onInteract(interaction: ButtonInteraction<CacheType>, relatedObjectId: ObjectId, executorId: string): Promise<InteractionUpdateOptions> {
        const request = await MongoManager.collections.awaitingIPConfirms.findOneAndDelete({ _id: relatedObjectId });
        if (request == null) {
            Logger.error(`Could not confirm IP for user with ID '${executorId}' as the request was null when it should not be.`);
            return editControlMessage(interaction, "Internal server error, please report!");
        }

        await MongoManager.collections.bannedIPs.updateOne({ ip: request.ipToAdd }, { ip: request.ipToAdd }, { upsert: true });

        return editControlMessage(interaction, "IP successfully reported!");
    }
}

function editControlMessage(interaction: ButtonInteraction<CacheType>, newContent: string): InteractionUpdateOptions {
    const replyButtons: ButtonBuilder[] = [];
    for (const buttonComponent of (interaction.message.components[0] as ActionRow<ButtonComponent>).components) {
        replyButtons.push(ButtonBuilder.from(buttonComponent).setDisabled(true));
    }

    const replyActionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(replyButtons);

    return { content: newContent, components: [replyActionRow] };
}
