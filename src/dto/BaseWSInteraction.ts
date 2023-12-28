import { MinecraftServerInteraction } from "./HTTPEndpointsStruct.js";
import { InteractionTypes } from "./InteractionTypes.js";

export abstract class BaseWSInteraction {
    public abstract interactionType: InteractionTypes;

    public abstract reply(buffer: MinecraftServerInteraction.Base): Promise<void>;
}

export interface IBaseWSInteraction {
    opcode: number | InteractionTypes;
    data: Omit<MinecraftServerInteraction.Base, "timestamp">;
}
