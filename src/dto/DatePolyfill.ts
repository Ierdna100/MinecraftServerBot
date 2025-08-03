declare global {
    interface Date {
        getWeek(): number;
        getWeekOfMonth(): number;
        getDaysInMonth(): number;
    }
}

export {};

const millisecondsPerDay = 24 * 60 * 60 * 1000;

export function loadDatePolyfill() {
    Date.prototype.getWeek = function () {
        const firstDay = new Date(this.getFullYear(), 0, 1, 0, 0, 0, 0);
        const daysToSunday = 7 - firstDay.getDay();
        const firstSunday = new Date(firstDay.getTime() + daysToSunday * millisecondsPerDay);

        if (this.getTime() < firstSunday.getTime()) {
            return 52;
        }

        const dateSinceYearBegan = new Date(this.getTime()).setUTCHours(0, 0, 0, 0);
        const dayOfTheYear = (dateSinceYearBegan - firstDay.getTime()) / millisecondsPerDay + 1;

        return Math.ceil((dayOfTheYear - firstSunday.getDate() + 1) / 7);
    };

    Date.prototype.getWeekOfMonth = function () {
        const firstDay = new Date(this.getFullYear(), this.getMonth(), 1, 0, 0, 0, 0);
        const daysToSunday = firstDay.getDay() == 0 ? 0 : 7 - firstDay.getDay();
        const firstSunday = new Date(firstDay.getTime() + daysToSunday * millisecondsPerDay);

        if (this.getTime() < firstSunday.getTime()) {
            const lastDayOfLastMonth = new Date(this.getFullYear(), this.getMonth(), 0, 0, 0, 0, 0);
            return -lastDayOfLastMonth.getWeekOfMonth();
        }

        const dateSinceMonthBegan = new Date(this.getTime()).setUTCHours(0, 0, 0, 0);
        const dayOfTheYear = (dateSinceMonthBegan - firstDay.getTime()) / millisecondsPerDay + 1;

        return Math.ceil((dayOfTheYear - firstSunday.getDate() + 1) / 7);
    };

    Date.prototype.getDaysInMonth = function () {
        return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
    };
}
