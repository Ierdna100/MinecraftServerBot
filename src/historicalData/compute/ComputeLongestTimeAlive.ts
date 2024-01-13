import { TimeEventType } from "../../dto/TimeEventType.js";
import { HistoricalData } from "../HistoricalData.js";

export class ComputeLongestTimeAlive {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        for (const player of historicalData.players) {
            let timeAlive = 0;
            let longestTimeAlive = 0;

            for (const session of player.sessions) {
                if (session.length == undefined) {
                    console.log("Session length was undefined!");
                    continue;
                }

                if (session.endType != TimeEventType.death) {
                    timeAlive += session.length;
                    continue;
                }

                if (timeAlive <= longestTimeAlive) {
                    continue;
                }

                longestTimeAlive = timeAlive;
                timeAlive = 0;

                const timeframe = Math.floor(
                    (session.end!.getTime() - historicalData.startTime.getTime()) /
                        (1000 * 60 * HistoricalData.pollingFrequencyMinutes)
                );

                for (let i = timeframe; i < player.longestTimeAlive.length; i++) {
                    player.longestTimeAlive[i] = longestTimeAlive;
                }
            }
        }
    }
}
