import fs from "fs";
import { Application } from "../Application.js";
import { MinecraftServerInteraction } from "../dto/HTTPEndpointsStruct.js";
import { CacheManager } from "./CacheManager.js";
import { ComputePlayers } from "./compute/ComputePlayers.js";
import { ComputeAdvancementData } from "./compute/ComputeAdvancementData.js";
import { ComputeDeathData } from "./compute/ComputeDeathData.js";
import { ComputePlayerJoins } from "./compute/ComputePlayerJoins.js";
import { ComputeAverageTimeAlive } from "./compute/ComputeAverageTimeAlive.js";
import { ComputeTimePlayed } from "./compute/ComputeTimePlayed.js";
import { ComputeSessions } from "./compute/ComputeSessions.js";
import { ComputeLongestTimeAlive } from "./compute/ComputeLongestTimeAlive.js";
import { HistoricalPlayerData } from "../dto/HistoricalPlayerData.js";
import { MapDataPointIndex, NumberArrayDataPointIndex } from "../dto/DataPointIndices.js";
import { CacheType, ChatInputCommandInteraction } from "discord.js";

export class HistoricalData {
    public interaction: ChatInputCommandInteraction<CacheType>;
    public players: HistoricalPlayerData[] = [];
    public startTime!: Date;
    public endTime!: Date;
    public arrayLength!: number;
    public static pollingFrequencyMinutes = Application.instance.env.historicalDataPollingRateMin;

    constructor(interaction: ChatInputCommandInteraction<CacheType>) {
        this.interaction = interaction;
        this.ctor();
    }

    private async ctor() {
        this.startTime = new Date(
            (
                (await Application.instance.collections.starts
                    .find()
                    .sort({ timestamp: 1 })
                    .limit(1)
                    .toArray()) as unknown as MinecraftServerInteraction.Base[]
            )[0].timestamp
        );
        this.endTime = new Date();
        this.arrayLength = Math.ceil(
            (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60 * HistoricalData.pollingFrequencyMinutes)
        );

        CacheManager.generateCache().then(() => {
            this.computeAndSendData();
        });
    }

    private async computeAndSendData() {
        await ComputePlayers.compute(this);
        await ComputeSessions.compute(this);

        await ComputeDeathData.compute(this);
        await this.sendData(this.numberArrayDataToCsv("deaths"), "deaths.csv");
        await this.sendData(this.numberArrayDataToCsv("kills"), "killsOverTime.csv");
        await this.sendData(
            this.mapDataToCsv("playersKilled", "Killer", "Killed", "Count"),
            "playersKilledByCount.csv"
        );

        await ComputeAdvancementData.compute(this);
        await this.sendData(this.numberArrayDataToCsv("advancements"), "advancements.csv");

        await ComputePlayerJoins.compute(this);
        await this.sendData(this.numberArrayDataToCsv("joins"), "playerJoins.csv");

        await ComputeTimePlayed.compute(this);
        await this.sendData(this.numberArrayDataToCsv("timePlayed"), "timePlayed.csv");

        await ComputeAverageTimeAlive.compute(this);
        await this.sendData(this.numberArrayDataToCsv("averageTimeAlive"), "averageTimeAlive.csv");

        await ComputeLongestTimeAlive.compute(this);
        await this.sendData(this.numberArrayDataToCsv("longestTimeAlive"), "longestTimeAlive.csv");

        this.interaction.editReply("**Successfully generated historical data!**");
    }

    private numberArrayDataToCsv(index: NumberArrayDataPointIndex): string {
        let csv = "";

        csv += "Player,";
        for (let i = 0; i < this.arrayLength; i++) {
            csv += `Day ${Math.floor(i / 24)} Hour ${(i % 24) + 1},`;
        }
        csv += "\n";

        for (const player of this.players) {
            csv += player.name + ",";

            for (const dataPoint of player[index]) {
                csv += dataPoint.toString() + ",";
            }

            csv += "\n";
        }

        return csv;
    }

    private mapDataToCsv(index: MapDataPointIndex, xName: string, yName: string, valueName: string): string {
        let csv: string = `${xName},${yName},${valueName}\n`;

        for (const player of this.players) {
            for (const dataPoint of player[index]) {
                csv += `${player.name},${dataPoint[0]},${dataPoint[1]}\n`;
            }
        }

        return csv;
    }

    private async sendData(data: string, filename: string) {
        const fullFilename = `./temp/${filename}`;
        fs.writeFileSync(fullFilename, data);

        await this.interaction.user.send({
            files: [fullFilename]
        });
    }
}
