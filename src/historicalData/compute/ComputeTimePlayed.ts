import { HistoricalData } from "../HistoricalData.js";

export class ComputeTimePlayed {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        for (const player of historicalData.players) {
            for (const session of player.sessions) {
                if (session.length == undefined) {
                    console.log("Session length was undefined!");
                    continue;
                }

                const timeframe = Math.floor(
                    (session.start.getTime() - historicalData.startTime.getTime()) /
                        (1000 * 60 * HistoricalData.pollingFrequencyMinutes)
                );

                for (let i = timeframe; i < player.timePlayed.length; i++) {
                    player.timePlayed[i] += session.length / (1000 * 60 * HistoricalData.pollingFrequencyMinutes);
                }
            }
        }
    }
}
