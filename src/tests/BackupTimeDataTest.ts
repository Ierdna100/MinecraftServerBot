import { BackupTimeData } from "../dto/BackupTimeData.js";
import fs from "fs";
import { ANSICodes } from "../dto/ANSICodes.js";
import { EnvManager } from "../EnvManager.js";

export class BackupTimeDataTest {
    public test(output: string) {
        const millisecondsInADay = 24 * 60 * 60 * 1000;

        const dates: Date[] = [];

        const data = new BackupTimeData();
        let lowest = new Date(2038, 1).getTime();
        let highest = new Date(0).getTime();
        for (const file of fs.readdirSync(EnvManager.env.backupRelativePathDestination)) {
            const date = new Date(file.replaceAll("_", ":").replace(".zip", ""));
            const time = date.getTime();
            data.insert(date, file);
            if (time < lowest) {
                lowest = time;
            }
            if (time > highest) {
                highest = time;
            }
        }
        data.sort(true);

        const lowestDate = new Date(lowest).setHours(0, 0, 0, 0);
        for (let i = lowestDate; i < highest; i += millisecondsInADay) {
            const time = new Date(i);
            data.insert(time, "");
        }

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        data.sort(true);
        fs.writeFileSync(output.replace(".txt", ".json"), JSON.stringify(data, null, "\t"));
        // return;

        let out: string[] = [];
        let lastMonth;
        for (const month of data.months) {
            out.push("╒══════════════════════════════════════════════════════════════╕");
            if (months[month.month] == undefined) {
                throw new Error(JSON.stringify(month));
            }
            out.push("│                  " + `${months[month.month]} ${month.year}`.padEnd(44, " ") + "│");
            let first = true;
            const includeWeekOfLastMonth = lastMonth != undefined && month.weeks[0].days[0].date.getDate() != 0;
            const weekData = includeWeekOfLastMonth ? [lastMonth!.weeks[lastMonth!.weeks.length - 1], ...month.weeks] : month.weeks;
            // const weekData = month.weeks;
            lastMonth = month;
            for (const week of weekData) {
                if (first) {
                    out.push("├────────┬────────┬────────┬────────┬────────┬────────┬────────┤");
                    first = false;
                } else {
                    out.push("├────────┼────────┼────────┼────────┼────────┼────────┼────────┤");
                }
                let l1 = "";
                let l2 = "";
                let l3 = "";

                let dayIdx = 0;
                for (let i = 0; i < week.days[0].day; i++) {
                    l1 += "│        ";
                    l2 += "│        ";
                    l3 += "│        ";
                    dayIdx++;
                    continue;
                }

                for (const day of week.days) {
                    let ansi = "";
                    if (month.month != day.date.getMonth()) {
                        ansi = ANSICodes.ForeBlack;
                    }

                    l1 += "│" + ansi + day.date.getDate().toString().padStart(7, " ") + " " + ANSICodes.Default;
                    // l2 += "│ " + ansi + `R: W${week.relativeWeek}`.padEnd(7, " ") + ANSICodes.Default;
                    // l3 += "│ " + ansi + `A: W${week.absoluteWeek}`.padEnd(7, " ") + ANSICodes.Default;
                    l2 += "│        ";
                    if (day.filenames.length > 1) {
                        l3 += "│ " + ansi + `#: ${day.filenames.length}`.padEnd(7, " ") + ANSICodes.Default;
                    } else {
                        l3 += "│        ";
                    }

                    dayIdx++;
                }

                for (; dayIdx < 7; dayIdx++) {
                    l1 += "│        ";
                    l2 += "│        ";
                    l3 += "│        ";
                }

                l1 += "│";
                l2 += "│";
                l3 += "│";

                out.push(l1, l2, l3);
            }

            out.push("└────────┴────────┴────────┴────────┴────────┴────────┴────────┘");
            out.push("", "", "");
        }

        for (const line of out) {
            console.log(line);
        }

        fs.writeFileSync(output, out.join("\n"));
    }
}
