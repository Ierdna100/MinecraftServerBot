import { IP } from "./IP.js";
import { UUID } from "./UUID.js";
import { Vec3 } from "./Vec3.js";
import { MinecraftDimension } from "./MinecraftDimension.js";

export namespace MinecraftServerInteraction {
    export interface Message {
        timestamp: Date;
        message: string;
        sender: UUID;
    }
    
    export interface death {
        userKilled: UUID;
        deathMsg: string;
    }
    
    export interface deathByEntity extends death {
        killer: UUID;
        killerIsPlayer: boolean;
    }
    
    export interface playerLeft {
        player: UUID;
        reason: string;
    }

    export interface playerAttemptedLogin {
        ip: IP;
        displayName: string;
        uuid: UUID;
    }
    
    export interface playerJoined extends playerAttemptedLogin {
        ip: IP;
        displayName: string;
        uuid: UUID;
        spawnPos: Vec3;
        spawnDimension: MinecraftDimension;
    }
    
    export interface playerFailedLogin {
        ip: IP;
        displayName: string;
        uuid: UUID;
    }
    
    export interface advancementNonProgressibleAcquired {
        user: string
        advancementName: string
    }
    
    export interface advancementProgressibleUpdated extends advancementNonProgressibleAcquired {
        isDone: boolean;
        progress: string;
    }
    
    export interface serverOverloadedWarning {
        millisecondsForLastFrame: number;
        ticksLastFrame: number;
    }
}
