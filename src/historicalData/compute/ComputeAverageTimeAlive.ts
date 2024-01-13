import { HistoricalData } from "../HistoricalData.js";

export class ComputeAverageTimeAlive {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        for (const player of historicalData.players) {
            for (let i = 0; i < player.deaths.length; i++) {
                player.averageTimeAlive[i] = player.timePlayed[i] / (player.deaths[i] + 1);
            }
        }
    }
}
