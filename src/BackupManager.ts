import fs from "fs";
import { EnvManager } from "./EnvManager.js";
import { Logger } from "./logging/Logger.js";
import archiver from "archiver";
import path from "path";
import { BackupTimeData } from "./dto/BackupTimeData.js";
import { EmbedBuilder } from "discord.js";
import { EmbedColors } from "./dto/EmbedColors.js";

export default class BackupManager {
    public static instance: BackupManager;

    public lastBackupTime: Date | undefined;
    private backupTime: Date;

    public initialize(): boolean {
        BackupManager.instance = this;

        if (!fs.existsSync(EnvManager.env.backupRelativePathToMinecraftRoot)) {
            Logger.fatal("Filepath for backup manager does not exist.");
            return false;
        }

        if (!this.parseBackupTime(EnvManager.env.backupTimeHours)) {
            return false;
        }
        Logger.info(`Backup time parsed as ${this.backupTime.toString()}`);

        this.lastBackupTime = this.getLastBackupTime();
        if (this.lastBackupTime == undefined) {
            Logger.info(`Resuming backup operation, no last backup.`);
        } else {
            Logger.info(`Resuming backup operation, last backup at: ${this.lastBackupTime?.toString()}`);
        }

        return true;
    }

    public async onGameSave(now: Date = new Date()) {
        const nowTimeOnly = new Date(now.getTime() % 86400000).getTime();
        const nowDateOnly = new Date(now.getTime()).setHours(0, 0, 0, 0);

        const shouldBackup = nowTimeOnly > this.backupTime.getTime();
        const alreadyBackedUpToday = this.lastBackupTime != undefined && nowDateOnly == new Date(this.lastBackupTime.getTime()).setHours(0, 0, 0, 0);
        console.log(new Date(nowTimeOnly));
        console.log(this.backupTime);
        console.log(new Date(nowDateOnly));
        console.log(new Date(new Date(this.lastBackupTime == undefined ? 0 : this.lastBackupTime.getTime()).setHours(0, 0, 0, 0)));

        if (!shouldBackup || alreadyBackedUpToday) {
            Logger.detail(`Not backing up, should have backed up?: ${shouldBackup}. Already backed up today?: ${alreadyBackedUpToday}`);
            return;
        }

        await this.backup(now);
    }

    public async backup(backupDate: Date) {
        this.lastBackupTime = backupDate;

        Logger.info("Starting backup...");
        const embed = new EmbedBuilder().setColor(EmbedColors.Orange).setTitle("Starting backup...").setTimestamp(new Date());
        Logger.broadcastPrivate({ embeds: [embed] });

        const startTime = new Date();
        const exitFilename = this.generateBackupName(backupDate);
        const exitPath = path.join(EnvManager.env.backupRelativePathDestination, exitFilename);
        const writeStream = fs.createWriteStream(exitPath);
        const zip = archiver("zip", { zlib: { level: 9 } });

        const deferredExitPromise = new Promise<void>((resolve, reject) => {
            writeStream.on("close", async () => {
                await this.finalizeBackup(startTime, exitFilename, zip.pointer());
                resolve();
            });
        });
        zip.on("warning", (err) => {
            if (err.code == "ENOENT") {
                Logger.warn(`${err.name}: ${err.message}`);
            } else {
                Logger.error(`${err.name}: ${err.message}`);
            }
        });
        zip.on("error", (err) => Logger.error(`${err.name}: ${err.message}`));

        zip.pipe(writeStream);
        zip.directory(EnvManager.env.backupRelativePathToMinecraftRoot, false);
        await zip.finalize();
        await deferredExitPromise;
    }

    private async finalizeBackup(startTime: Date, filename: string, finalFilesize: number) {
        const now = new Date();
        Logger.info(
            `Backup generated (${this.getHumanReadableByteSize(finalFilesize)}) with filename '${filename}'. Took ${now.getTime() - startTime.getTime()} ms`
        );

        const dir = fs.readdirSync(EnvManager.env.backupRelativePathDestination);
        const timedata = new BackupTimeData();

        const filesizeLimit = EnvManager.env.backupSizeGigabytes * 2 ** 30;
        let totalFilesize = 0;
        for (const file of dir) {
            totalFilesize += fs.statSync(path.join(EnvManager.env.backupRelativePathDestination, file)).size;
            timedata.insert(this.getBackupTimestampFromFilename(file), file);
        }

        const embed = new EmbedBuilder()
            .setColor(EmbedColors.Red)
            .setTimestamp(now)
            .setTitle("Backup generated")
            .addFields([
                { name: "Backup time", value: `\`${now.getTime() - startTime.getTime()}\` ms` },
                { name: "Backup name", value: `\`${filename}\`` },
                { name: "Backup size", value: `\`${this.getHumanReadableByteSize(finalFilesize)}\`` },
                { name: "Total backup size", value: `\`${this.getHumanReadableByteSize(totalFilesize)}\`` },
                { name: "Total backup size limit", value: `\`${this.getHumanReadableByteSize(filesizeLimit)}\`` }
            ]);

        Logger.info(`Total backup size is now ${this.getHumanReadableByteSize(totalFilesize)} (limit is ${this.getHumanReadableByteSize(filesizeLimit)})`);
        Logger.broadcastPrivate({ embeds: [embed] });
        if (totalFilesize <= filesizeLimit) {
            Logger.info("Not deleting previous backups: Backup size below maximum.");
            return;
        }

        timedata.sort();

        const lastMonth = timedata.months[timedata.months.length - 1];
        const lastWeek = lastMonth.weeks[lastMonth.weeks.length - 1];
        const markedForDeletion: string[] = [];
        for (const month of timedata.months) {
            const offsetWeeks = month.year != lastMonth.year ? 52 : 0;
            if (lastMonth.absoluteMonth() - month.absoluteMonth() > 2) {
                const firstWeekIdx = month.weeks[0].relativeWeek;
                for (const week of month.weeks) {
                    const firstDayIdx = week.days[0].day;
                    for (const day of week.days) {
                        if (week.relativeWeek == firstWeekIdx && day.day == firstDayIdx) continue;
                        day.filenames.forEach((f) => markedForDeletion.push(f));
                    }
                }
            } else {
                for (const week of month.weeks) {
                    if (lastWeek.absoluteWeek + offsetWeeks - week.absoluteWeek < 2) continue;
                    const firstDayIdx = week.days[0].day;
                    for (const day of week.days) {
                        if (day.day == firstDayIdx) continue;
                        day.filenames.forEach((f) => markedForDeletion.push(f));
                    }
                }
            }
        }

        Logger.info(`Marked ${markedForDeletion.length} backups for deletion. Deleting...`);
        const sizeBeforeTotal = totalFilesize;
        let filesDeleted = 0;
        markedForDeletion.sort();
        for (const toBeDeleted of markedForDeletion) {
            if (totalFilesize <= filesizeLimit) {
                Logger.info(
                    `Total backup size now ${this.getHumanReadableByteSize(totalFilesize)}, which is below the limit (${this.getHumanReadableByteSize(
                        filesizeLimit
                    )}), stopping backup deletion.`
                );
                break;
            }
            const sizeBefore = totalFilesize;
            totalFilesize -= this.deleteBackup(path.join(EnvManager.env.backupRelativePathDestination, toBeDeleted));
            filesDeleted++;
            Logger.info(`Deleted backup with name '${toBeDeleted}', saved ${this.getHumanReadableByteSize(sizeBefore - totalFilesize)}`);
        }
        Logger.info(`Deleted ${filesDeleted} backups, saving a total of ${this.getHumanReadableByteSize(sizeBeforeTotal - totalFilesize)}`);
        Logger.info("Finished pruning backups. Resuming listening to Discord API...");

        const embed2 = new EmbedBuilder()
            .setColor(EmbedColors.Orange)
            .setTimestamp(new Date())
            .setTitle(`Deleted ${filesDeleted} backups to save space.`)
            .setDescription(`saving a total of ${this.getHumanReadableByteSize(sizeBeforeTotal - totalFilesize)}`);

        Logger.broadcastPrivate({ embeds: [embed2] });
    }

    private deleteBackup(filepath: string): number {
        let deletedSize = 0;
        try {
            deletedSize += fs.statSync(filepath).size;
            fs.rmSync(filepath);
        } catch (err) {
            Logger.error((err as Error).stack!);
        }
        return deletedSize;
    }

    private getHumanReadableByteSize(bytes: number): string {
        if (bytes < 2 ** 10) {
            return `${bytes} B`;
        } else if (bytes < 2 ** 20) {
            return `${(bytes / 2 ** 10).toFixed(2)} KiB`;
        } else if (bytes < 2 ** 30) {
            return `${(bytes / 2 ** 20).toFixed(2)} MiB`;
        } else if (bytes < 2 ** 40) {
            return `${(bytes / 2 ** 30).toFixed(2)} GiB`;
        } else if (bytes < 2 ** 50) {
            return `${(bytes / 2 ** 40).toFixed(2)} TiB`;
        }

        return `${bytes} B`;
    }

    private generateBackupName(date: Date): string {
        return `${date.toISOString().replaceAll(":", "_")}.zip`;
    }

    private parseBackupTime(n: string): boolean {
        const asString = n.toString().trim();
        if (asString.length != "00:00".length) {
            Logger.fatal("Backup time is not parseable as a 24 hour time format. Format needs to be 'HH:MM'.");
            return false;
        }

        const [hrRaw, mnRaw] = asString.split(":");
        const hr = parseInt(hrRaw);
        const mn = parseInt(mnRaw);
        if (Number.isNaN(hr)) {
            Logger.fatal("Backup time hours needs to be a number but parsing it returned NaN!");
            return false;
        }
        if (Number.isNaN(mn)) {
            Logger.fatal("Backup time minutes needs to be a number but parsing it returned NaN!");
            return false;
        }

        if (hr < 0 || hr > 23) {
            Logger.fatal("Backup time hours need to be a value between 0 and 23!");
            return false;
        }
        if (mn < 0 || mn > 59) {
            Logger.fatal("Backup time hours need to be a value between 0 and 59!");
            return false;
        }

        const nowWithSetTime = new Date();
        nowWithSetTime.setHours(hr, mn, 0, 0);
        const asTime = new Date(nowWithSetTime.getTime() % (24 * 60 * 60 * 1000));
        this.backupTime = asTime;
        return true;
    }

    private getBackupTimestampFromFilename(name: string): Date {
        return new Date(name.replaceAll("_", ":").replace(".zip", ""));
    }

    private getLastBackupTime(): Date | undefined {
        const backups = fs.readdirSync(EnvManager.env.backupRelativePathDestination);

        let latest = undefined;
        for (const backup of backups) {
            const backupWithoutFileExtension = backup.replaceAll("_", ":").replace(".zip", "");
            const backupDate = new Date(backupWithoutFileExtension);
            if (latest == undefined || backupDate.getTime() > latest.getTime()) {
                latest = backupDate;
                continue;
            }
        }

        return latest;
    }
}
