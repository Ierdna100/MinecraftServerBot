import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { HistoricalData } from "../HistoricalData.js";
import fs from "fs";

export class ComputePlayerJoins {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        const data = JSON.parse(fs.readFileSync("./cache/joinsData").toString()) as MinecraftServerInteraction.PlayerJoined[];

        for (const join of data) {
            for (let i = 0; i < historicalData.players.length; i++) {
                if (historicalData.players[i].uuid != join.uuid) {
                    continue;
                }

                const deathTime = new Date(join.timestamp);
                const deathTimeFrame = Math.floor(
                    (deathTime.getTime() - historicalData.startTime.getTime()) / (1000 * 60 * HistoricalData.pollingFrequencyMinutes)
                );

                for (let j = deathTimeFrame; j < historicalData.players[i].deaths.length; j++) {
                    historicalData.players[i].joins[j]++;
                }

                break;
            }
        }
    }
}
