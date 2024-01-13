import { Application } from "../../Application.js";
import { MongoModel_MinecraftUser } from "../../dto/MongoModels.js";
import { HistoricalData } from "../HistoricalData.js";

export class ComputePlayers {
    public static async compute(historicalData: HistoricalData) {
        const data = (await Application.instance.collections.auth.find().toArray()) as MongoModel_MinecraftUser[];

        for (const player of data) {
            historicalData.players.push({
                uuid: player.uuid!,
                name: player.displayName,
                sessions: [],
                advancements: new Array(historicalData.arrayLength).fill(0),
                deaths: new Array(historicalData.arrayLength).fill(0),
                kills: new Array(historicalData.arrayLength).fill(0),
                joins: new Array(historicalData.arrayLength).fill(0),
                timePlayed: new Array(historicalData.arrayLength).fill(0),
                averageTimeAlive: new Array(historicalData.arrayLength).fill(0),
                longestTimeAlive: new Array(historicalData.arrayLength).fill(0),
                playersKilled: new Map<string, number>()
            });
        }

        for (const player of historicalData.players) {
            for (const playerToAdd of historicalData.players) {
                if (player.uuid == playerToAdd.uuid) {
                    player.playersKilled.set(playerToAdd.name, -1);
                    continue;
                }

                player.playersKilled.set(playerToAdd.name, 0);
            }
        }
    }
}
