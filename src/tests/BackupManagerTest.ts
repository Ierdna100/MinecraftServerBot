import BackupManager from "../BackupManager.js";
import { EnvManager } from "../EnvManager.js";
import { Logger } from "../logging/Logger.js";
import fs from "fs";

export class BackupManagerTest {
    public async test() {
        const backupTestTimes: Date[] = [
            new Date("2025-08-01T17:00:00Z"),
            new Date("2025-08-02T17:00:00Z"),
            new Date("2025-08-03T17:00:00Z"),
            new Date("2025-08-04T17:00:00Z"),
            new Date("2025-08-05T17:00:00Z"),
            new Date("2025-08-06T17:00:00Z"),
            new Date("2025-08-07T17:00:00Z"),
            new Date("2025-08-08T17:00:00Z"),
            new Date("2025-08-09T17:00:00Z"),
            new Date("2025-08-10T17:00:00Z"),
            new Date("2025-08-11T17:00:00Z"),
            new Date("2025-08-12T17:00:00Z"),
            new Date("2025-08-13T17:00:00Z"),
            new Date("2025-08-14T17:00:00Z"),
            new Date("2025-08-15T17:00:00Z"),
            new Date("2025-08-16T17:00:00Z"),
            new Date("2025-08-17T17:00:00Z"),
            new Date("2025-08-18T17:00:00Z"),
            new Date("2025-08-19T17:00:00Z"),
            new Date("2025-08-20T17:00:00Z"),
            new Date("2025-08-21T17:00:00Z"),
            new Date("2025-08-22T17:00:00Z"),
            new Date("2025-08-23T17:00:00Z"),
            new Date("2025-08-24T17:00:00Z"),
            new Date("2025-08-25T17:00:00Z"),
            new Date("2025-08-26T17:00:00Z"),
            new Date("2025-08-27T17:00:00Z"),
            new Date("2025-08-28T17:00:00Z"),
            new Date("2025-08-29T17:00:00Z"),
            new Date("2025-08-30T17:00:00Z"),
            new Date("2025-08-31T17:00:00Z"),
            new Date("2025-09-01T17:00:00Z"),
            new Date("2025-09-02T17:00:00Z"),
            new Date("2025-09-03T17:00:00Z"),
            new Date("2025-09-04T17:00:00Z"),
            new Date("2025-09-05T17:00:00Z"),
            new Date("2025-09-06T17:00:00Z"),
            new Date("2025-09-07T17:00:00Z"),
            new Date("2025-09-08T17:00:00Z"),
            new Date("2025-09-09T17:00:00Z"),
            new Date("2025-09-10T17:00:00Z"),
            new Date("2025-09-11T17:00:00Z"),
            new Date("2025-09-12T17:00:00Z"),
            new Date("2025-09-13T17:00:00Z"),
            new Date("2025-09-14T17:00:00Z"),
            new Date("2025-09-15T17:00:00Z"),
            new Date("2025-09-16T17:00:00Z"),
            new Date("2025-09-17T17:00:00Z"),
            new Date("2025-09-18T17:00:00Z"),
            new Date("2025-09-20T04:00:00"),
            new Date("2025-09-20T17:00:00"),
            new Date("2025-09-20T19:00:00")
        ];

        for (const testTime of backupTestTimes) {
            Logger.info(`Backup test at date: ${testTime}`);
            await BackupManager.instance.onGameSave(testTime);
        }
    }
}
