import { PlaySession } from "./PlaySession.js";

export interface HistoricalPlayerData {
    uuid: string;
    name: string;
    advancements: number[];
    deaths: number[];
    kills: number[];
    joins: number[];
    timePlayed: number[];
    averageTimeAlive: number[];
    longestTimeAlive: number[];
    playersKilled: Map<string, number>;
    sessions: PlaySession[];
}
