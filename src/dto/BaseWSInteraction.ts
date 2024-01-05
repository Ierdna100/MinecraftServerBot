import { MinecraftServerInteraction } from "./HTTPEndpointsStruct.js";
import { WebsocketOpcodes } from "./WebsocketOpcodes.js";

export abstract class BaseWSInteraction {
    public abstract interactionType: WebsocketOpcodes;

    public abstract reply(buffer: MinecraftServerInteraction.Base): Promise<void>;
}

export interface IBaseWSInteraction {
    opcode: number | WebsocketOpcodes;
    data: Omit<MinecraftServerInteraction.Base, "timestamp">;
}
