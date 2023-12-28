export namespace MinecraftServerInteraction {
    export interface Base {
        timestamp: Date;
    }

    export interface Message extends Base {
        message: string;
        sender: string;
    }

    export interface death extends Base {
        userKilled: string;
        deathMsg: string;
    }

    export interface deathByEntity extends death {
        killer: string;
        killerIsPlayer: boolean;
    }

    export interface playerLeft extends Base {
        uuid: string;
        reason: string;
    }

    export interface playerAttemptedLogin extends Base {
        ip: string;
        displayName: string;
        uuid: string;
    }

    export interface playerJoined extends playerAttemptedLogin {
        ip: string;
        displayName: string;
        uuid: string;
        x: number;
        y: number;
        z: number;
        spawnDimension: string;
    }

    export interface playerFailedLogin extends Base {
        ip: string;
        displayName: string;
        uuid: string;
    }

    export interface advancementNonProgressibleAcquired extends Base {
        uuid: string;
        advancementName: string;
    }

    export interface advancementProgressibleUpdated extends advancementNonProgressibleAcquired {
        isDone: boolean;
        progress: string;
    }

    export interface serverOverloadedWarning extends Base {
        millisecondsForLastFrame: number;
        ticksLastFrame: number;
    }
}
