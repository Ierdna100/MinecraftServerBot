import { ButtonBuilder, ButtonComponent, ButtonInteraction, ButtonStyle, CacheType } from "discord.js";
import { BaseButton } from "../../dto/BaseButton.js";

class Button_AcceptUnauthenticatedUser extends BaseButton {
    //prettier-ignore
    public builder = new ButtonBuilder()
        .setStyle(ButtonStyle.Primary)
        .setLabel("Authenticate");

    public async handle(interaction: ButtonInteraction<CacheType>, clickerId: string): Promise<void> {
        await interaction.editReply();
    }
}
