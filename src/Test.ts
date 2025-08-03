import BackupManager from "./BackupManager.js";
import { loadDatePolyfill } from "./dto/DatePolyfill.js";
import { EnvManager } from "./EnvManager.js";
import { Logger } from "./logging/Logger.js";
import { BackupManagerTest } from "./tests/BackupManagerTest.js";
import fs from "fs";
import { BackupTimeDataTest } from "./tests/BackupTimeDataTest.js";

loadDatePolyfill();

Logger.detail(`Current working directory: ${process.cwd()}`);

const success = EnvManager.readAndParse();
if (!success.success) {
    success.errors.forEach((e) => Logger.fatal(e));
    process.exit(1);
}
Logger.initializeLevelsFromSettings();

// Logger.info("Deleting all previous backups for backup test.");
// fs.rmSync(EnvManager.env.backupRelativePathDestination, { recursive: true, force: true });
// fs.mkdirSync(EnvManager.env.backupRelativePathDestination);
// Logger.info("Done.");

if (!new BackupManager().initialize()) {
    process.exit(1);
}

// Tests
new BackupTimeDataTest().test("./test/calendar1.txt");
await new BackupManagerTest().test();
new BackupTimeDataTest().test("./test/calendar2.txt");
