import { MinecraftServerInteraction } from "./HTTPEndpointsStruct.js";
import { InteractionTypes } from "./InteractionTypes.js";

export abstract class BaseWSInteraction {
    public abstract interactionType: InteractionTypes;

    public abstract reply(buffer: MinecraftServerInteraction.Base): Promise<void>;
}

export interface IBaseWSInteraction {
    interactionType: InteractionTypes;
    data: MinecraftServerInteraction.Base;
}
