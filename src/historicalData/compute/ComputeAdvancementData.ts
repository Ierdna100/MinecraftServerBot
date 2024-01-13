import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import { HistoricalData } from "../HistoricalData.js";
import fs from "fs";

export class ComputeAdvancementData {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        const data = JSON.parse(
            fs.readFileSync("./cache/advancementData").toString()
        ) as MinecraftServerInteraction.advancementProgressibleUpdated[];

        for (const advancement of data) {
            for (let i = 0; i < historicalData.players.length; i++) {
                if (historicalData.players[i].uuid != advancement.uuid) {
                    continue;
                }

                const advancementTime = new Date(advancement.timestamp);
                const advancementTimeframe = Math.floor(
                    (advancementTime.getTime() - historicalData.startTime.getTime()) /
                        (1000 * 60 * HistoricalData.pollingFrequencyMinutes)
                );

                let valueToAdd = 1;

                if (advancement.progress != undefined) {
                    const fraction = advancement.progress.replaceAll(" ", "").split("/");
                    valueToAdd = parseFloat(fraction[0]) / parseFloat(fraction[1]);
                }

                for (let j = advancementTimeframe; j < historicalData.players[i].advancements.length; j++) {
                    historicalData.players[i].advancements[j] += valueToAdd;
                }

                break;
            }
        }
    }
}
