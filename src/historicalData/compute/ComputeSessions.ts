import { MinecraftServerInteraction } from "../../dto/HTTPEndpointsStruct.js";
import fs from "fs";
import { TimePlayedEvent } from "../../dto/TimePlayedEvent.js";
import { HistoricalData } from "../HistoricalData.js";
import { TimeEventType } from "../../dto/TimeEventType.js";
import { PlaySession } from "../../dto/PlaySession.js";

export class ComputeSessions {
    public static async compute(historicalData: HistoricalData): Promise<void> {
        const events: TimePlayedEvent[] = [];

        JSON.parse(fs.readFileSync("./cache/joinsData").toString()).forEach((e: MinecraftServerInteraction.PlayerJoined) => {
            events.push({
                uuid: e.uuid,
                timestamp: new Date(e.timestamp),
                type: TimeEventType.join
            });
        });

        JSON.parse(fs.readFileSync("./cache/leavesData").toString()).forEach((e: MinecraftServerInteraction.PlayerLeft) => {
            events.push({
                uuid: e.uuid,
                timestamp: new Date(e.timestamp),
                type: TimeEventType.leave
            });
        });

        JSON.parse(fs.readFileSync("./cache/stopData").toString()).forEach((e: MinecraftServerInteraction.Base) => {
            events.push({
                timestamp: new Date(e.timestamp),
                type: TimeEventType.serverStop
            });
        });

        JSON.parse(fs.readFileSync("./cache/deathData").toString()).forEach((e: MinecraftServerInteraction.Death) => {
            events.push({
                timestamp: new Date(e.timestamp),
                type: TimeEventType.death
            });
        });

        let timestamps = new Array(historicalData.arrayLength);
        for (let i = 0; i < timestamps.length; i++) {
            timestamps[i] = new Date(historicalData.startTime.getTime() + i * 1000 * 60 * HistoricalData.pollingFrequencyMinutes);
        }
        timestamps.forEach((e: Date) => {
            events.push({
                type: TimeEventType.timestamp,
                timestamp: e
            });
        });

        events.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        // let finalData: { name: string; sessions: number; time: number }[] = [];

        for (const player of historicalData.players) {
            let sessions: PlaySession[] = [];
            // let totalLength: number = 0;
            let currentSession: PlaySession | undefined = undefined;

            for (const event of events) {
                if (event.uuid != undefined && event.uuid != player.uuid) {
                    continue;
                }

                switch (event.type) {
                    case TimeEventType.join:
                        currentSession = {
                            length: undefined,
                            start: event.timestamp,
                            end: undefined,
                            startType: TimeEventType.join,
                            endType: undefined
                        };
                        break;
                    case TimeEventType.leave:
                    case TimeEventType.serverStop:
                        if (currentSession == undefined) {
                            break;
                        }

                        currentSession.end = event.timestamp;
                        currentSession.length = currentSession.end.getTime() - currentSession.start.getTime();
                        currentSession.endType = TimeEventType.leave;
                        // totalLength += currentSession.length;
                        sessions.push(currentSession);
                        currentSession = undefined;
                        break;
                    case TimeEventType.timestamp:
                        if (currentSession == undefined) {
                            break;
                        }
                        currentSession.end = event.timestamp;
                        currentSession.length = currentSession.end.getTime() - currentSession.start.getTime();
                        currentSession.endType = TimeEventType.timestamp;
                        // totalLength += currentSession.length;
                        sessions.push(currentSession);

                        currentSession = {
                            length: undefined,
                            start: event.timestamp,
                            end: undefined,
                            startType: TimeEventType.timestamp,
                            endType: undefined
                        };
                        break;
                    case TimeEventType.death:
                        if (currentSession == undefined) {
                            break;
                        }
                        currentSession.end = event.timestamp;
                        currentSession.length = currentSession.end.getTime() - currentSession.start.getTime();
                        currentSession.endType = TimeEventType.death;
                        // totalLength += currentSession.length;
                        sessions.push(currentSession);

                        currentSession = {
                            length: undefined,
                            start: event.timestamp,
                            end: undefined,
                            startType: TimeEventType.death,
                            endType: undefined
                        };
                        break;
                }
            }

            player.sessions = sessions.sort((a, b) => a.end!.getTime() - b.end!.getTime());
        }
    }
}
