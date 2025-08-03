export class BackupTimeData {
    public months: BackupMonthData[] = [];
    public sorted = false;

    public insert(date: Date, filename: string) {
        const isPreviousMonth = date.getWeekOfMonth() < 0;
        const insertMonthUnclamped = isPreviousMonth ? date.getMonth() - 1 : date.getMonth();
        const insertMonth = insertMonthUnclamped < 0 ? 11 : insertMonthUnclamped;
        const insertYear = insertMonthUnclamped < 0 ? date.getFullYear() - 1 : date.getFullYear();

        let foundMonth: BackupMonthData | undefined = undefined;
        for (const month of this.months) {
            if (!(month.month == insertMonth && month.year == insertYear)) continue;
            foundMonth = month;
            break;
        }

        if (foundMonth == undefined) {
            foundMonth = new BackupMonthData(insertYear, insertMonth);
            this.months.push(foundMonth);
            this.sorted = false;
        }

        foundMonth.insert(date, filename);
    }

    public sort(force: boolean = false) {
        if (!force && this.sorted) {
            return;
        }
        this.months.sort(this.sortMonths);
        this.months.forEach((m) => {
            m.weeks.sort(this.sortWeeks);
            m.weeks.forEach((w) => w.days.sort(this.sortDays));
        });
        this.sorted = true;
    }

    private sortMonths(m1: BackupMonthData, m2: BackupMonthData) {
        return m1.year * 12 + m1.month - (m2.year * 12 + m2.month);
    }

    private sortWeeks(w1: BackupWeekData, w2: BackupWeekData) {
        return w1.relativeWeek - w2.relativeWeek;
    }

    private sortDays(d1: BackupDayData, d2: BackupDayData) {
        return d1.day - d2.day;
    }
}

export class BackupMonthData {
    public weeks: BackupWeekData[] = [];

    constructor(
        public year: number,
        public month: number
    ) {}

    public absoluteMonth() {
        return this.month + this.year * 12;
    }

    public insert(date: Date, filename: string) {
        const insertWeek = Math.abs(date.getWeekOfMonth());

        let foundWeek: BackupWeekData | undefined = undefined;
        for (const week of this.weeks) {
            if (week.relativeWeek != insertWeek) continue;
            foundWeek = week;
            break;
        }

        if (foundWeek == undefined) {
            foundWeek = new BackupWeekData(insertWeek, date.getWeek());
            this.weeks.push(foundWeek);
        }

        foundWeek.insert(date, filename);
    }
}

export class BackupWeekData {
    public days: BackupDayData[] = [];

    constructor(
        public relativeWeek: number,
        public absoluteWeek: number
    ) {}

    public insert(date: Date, filename: string) {
        const insertDay = date.getDay();

        let foundDay: BackupDayData | undefined = undefined;
        for (const day of this.days) {
            if (day.day != insertDay) continue;
            foundDay = day;
            break;
        }

        if (foundDay == undefined) {
            foundDay = { date: date, day: insertDay, filenames: [] };
            this.days.push(foundDay);
        }

        foundDay.filenames.push(filename);
    }
}

export type BackupDayData = {
    date: Date;
    day: number;
    filenames: string[];
};
