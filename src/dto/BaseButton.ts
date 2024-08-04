import { ButtonBuilder, ButtonInteraction, CacheType } from "discord.js";

abstract class BaseButton {
    public abstract builder: ButtonBuilder;

    public abstract handle(interaction: ButtonInteraction<CacheType>, clickerId: string): Promise<void>;
}

export { BaseButton };
