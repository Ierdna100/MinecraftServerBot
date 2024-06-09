import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { HistoricalData } from "../HistoricalData.js";
import fs from "fs";

export class ComputeDeathData {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        const data = JSON.parse(fs.readFileSync("./cache/deathData").toString()) as MinecraftServerInteraction.DeathByEntity[];

        for (const death of data) {
            for (const player of historicalData.players) {
                if (player.uuid != death.killed) {
                    continue;
                }

                const deathTime = new Date(death.timestamp);
                const deathTimeFrame = Math.floor(
                    (deathTime.getTime() - historicalData.startTime.getTime()) / (1000 * 60 * HistoricalData.pollingFrequencyMinutes)
                );

                for (let i = deathTimeFrame; i < player.deaths.length; i++) {
                    player.deaths[i]++;
                }

                if (death.killerIsPlayer) {
                    for (const potentialKiller of historicalData.players) {
                        if (potentialKiller.uuid != death.killer) {
                            continue;
                        }
                        console.log("Adding killer " + potentialKiller.name);
                        for (let i = deathTimeFrame; i < player.deaths.length; i++) {
                            potentialKiller.kills[i]++;
                        }

                        potentialKiller.playersKilled.set(player.name, potentialKiller.playersKilled.get(player.name)! + 1);

                        break;
                    }
                }

                break;
            }
        }
    }
}
