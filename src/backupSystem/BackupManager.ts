import { Logger } from "../logging/Logger.js";
import * as ZipLib from "zip-lib";
import { FileUtils } from "../fileUtils/FileUtils.js";

export class BackupManager {
    public parentSaveFolder: string;
    public worldFolder: string;
    public saveRateInHours: number;

    constructor(parentSaveFolderName: string, worldFolder: string, saveRateInHours: number) {
        this.worldFolder = FileUtils.formatDirName(worldFolder);
        this.parentSaveFolder = FileUtils.formatDirName(parentSaveFolderName);
        this.saveRateInHours = saveRateInHours;

        const saveTimeInSec = this.saveRateInHours * 60 * 60 * 1000;

        setTimeout(() => this.backupServer(), saveTimeInSec);
        Logger.info(`Backup manager started! Backing up in ${saveRateInHours} hours!`);
    }

    public async backupServer() {
        const backupFilepath = `${this.parentSaveFolder}/${this.generateBackupName()}`;
        await ZipLib.archiveFolder(this.worldFolder, backupFilepath);

        setTimeout(() => this.backupServer());
    }

    public generateBackupName(): string {
        return `backup-${new Date().toISOString().replaceAll(":", "-")}.zip`;
    }
}
