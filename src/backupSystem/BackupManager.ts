import { Logger } from "../logging/Logger.js";
import * as ZipLib from "zip-lib";
import { Application } from "../Application.js";
import { PeriodicMessageType } from "../dto/PeriodicMessageReference.js";
import Path from "path";

export class BackupManager {
    public parentSaveFolder!: string;
    public worldFolder!: string;
    public saveRateInHours!: number;
    public lastBackupAt: Date | undefined;

    constructor(parentSaveFolderName: string, worldFolder: string, saveRateInHours: number) {
        this.ctor(parentSaveFolderName, worldFolder, saveRateInHours);
    }

    public async ctor(parentSaveFolderName: string, worldFolder: string, saveRateInHours: number) {
        this.worldFolder = Path.resolve(worldFolder);
        this.parentSaveFolder = Path.resolve(parentSaveFolderName);
        this.saveRateInHours = saveRateInHours;
        const possiblePreviousBackupDate = await Application.instance.collections.serverData.findOne<{ date: Date }>({ type: PeriodicMessageType.backupTime });
        if (possiblePreviousBackupDate != null) {
            this.lastBackupAt = possiblePreviousBackupDate.date;
        }

        Logger.info("Backup manager started!");
        const millisecPerHour = 1000 * 60 * 60;

        Logger.info("Last backup at: " + this.lastBackupAt);

        if (this.lastBackupAt == undefined) {
            setTimeout(() => this.backupServer(), this.saveRateInHours * millisecPerHour);
            Logger.info(`No previous backup found. Backing up in ${saveRateInHours} hours!`);
            return;
        }

        const timeDifference = new Date().getTime() - this.lastBackupAt.getTime();

        if (timeDifference / millisecPerHour > this.saveRateInHours) {
            this.backupServer();
            setTimeout(() => this.backupServer(), this.saveRateInHours * millisecPerHour);
            Logger.info("Backed up server once because the last backup was too long ago!");
            Logger.info(`Backing up again in ${saveRateInHours} hours!`);
        } else {
            const saveRateInMillisec = this.saveRateInHours * millisecPerHour;
            const backupInMs = saveRateInMillisec - timeDifference;
            setTimeout(() => this.backupServer(), this.saveRateInHours * millisecPerHour - this.lastBackupAt.getTime());
            Logger.info(`Backing up in ${saveRateInHours} hours!`);
        }
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
