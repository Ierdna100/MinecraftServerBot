import { Logger } from "../logging/Logger.js";
import * as ZipLib from "zip-lib";
import { FileUtils } from "../fileUtils/FileUtils.js";
import { Application } from "../Application.js";
import { PeriodicMessageType } from "../dto/PeriodicMessageReference.js";

export class BackupManager {
    public parentSaveFolder!: string;
    public worldFolder!: string;
    public saveRateInHours!: number;
    public lastBackupAt: Date | undefined;

    constructor(parentSaveFolderName: string, worldFolder: string, saveRateInHours: number) {
        this.ctor(parentSaveFolderName, worldFolder, saveRateInHours);
    }

    public async ctor(parentSaveFolderName: string, worldFolder: string, saveRateInHours: number) {
        this.worldFolder = FileUtils.formatDirName(worldFolder);
        this.parentSaveFolder = FileUtils.formatDirName(parentSaveFolderName);
        this.saveRateInHours = saveRateInHours;
        const possiblePreviousBackupDate = await Application.instance.collections.serverData.findOne<{ date: Date }>({ type: PeriodicMessageType.backupTime });
        if (possiblePreviousBackupDate != null) {
            this.lastBackupAt = possiblePreviousBackupDate.date;
        }

        setTimeout(() => this.backupServer(), this.saveRateInHours * 60 * 60 * 1000);
        Logger.info(`Backup manager started! Backing up in ${saveRateInHours} hours!`);
    }

    public async backupServer() {
        const backupFilepath = `${this.parentSaveFolder}/${this.generateBackupName()}`;
        await ZipLib.archiveFolder(this.worldFolder, backupFilepath);
        this.lastBackupAt = new Date();
        await Application.instance.collections.serverData.replaceOne(
            { type: PeriodicMessageType.backupTime },
            { type: PeriodicMessageType.backupTime, date: this.lastBackupAt }
        );

        setTimeout(() => this.backupServer(), this.saveRateInHours * 60 * 60 * 1000);
    }

    public generateBackupName(): string {
        return `backup-${new Date().toISOString().replaceAll(":", "-")}.zip`;
    }
}
