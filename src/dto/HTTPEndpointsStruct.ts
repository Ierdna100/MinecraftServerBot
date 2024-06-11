import { WebsocketTypes } from "./WebsocketTypes.js";

export namespace MinecraftServerInteraction {
    export interface Base {
        timestamp: Date;
    }

    export interface AuthData extends Base {
        password: string;
        requestHeaders: WebsocketTypes;
    }

    export interface GlobalData extends Base {
        seed: string;
        maxPlayers: number;
        currentPlayerCount: number;
        version: string;
        MOTD: string;
        currentPlayers: string[];
        mcServerUpTimeMillisec: number;
        day: number;
    }

    export interface Message extends Base {
        message: string;
        sender: string;
    }

    export interface Death extends Base {
        deathType: "normal" | "byEntity" | "byPlayer" | "byPlayerWithItem";
        key: string;
        killed: string;
    }

    export interface DeathByEntity extends Death {
        killer: string;
        killerIsPlayer: boolean;
        killerType: string;
    }

    export interface DeathWithItem extends DeathByEntity {
        itemType: string;
        itemName: string;
    }

    export interface PlayerLeft extends Base {
        uuid: string;
        reason: string;
    }

    export interface PlayerAttemptedLogin extends Base {
        ip: string;
        displayName: string;
        uuid: string;
    }

    export interface PlayerJoined extends PlayerAttemptedLogin {
        ip: string;
        displayName: string;
        uuid: string;
        x: number;
        y: number;
        z: number;
        spawnDimension: string;
    }

    export interface PlayerFailedLogin extends Base {
        ip: string;
        displayName: string;
        uuid: string;
    }

    export interface AdvancementNonProgressibleAcquired extends Base {
        uuid: string;
        name: string;
    }

    export interface AdvancementProgressibleUpdated extends AdvancementNonProgressibleAcquired {
        isDone: boolean;
        progress: string;
    }

    export interface ServerOverloadedWarning extends Base {
        millisecondsBehind: number;
        ticksBehind: number;
    }
}
