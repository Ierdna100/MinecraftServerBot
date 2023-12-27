export class Logger {
    // TODO: left to implement showName, parseDetails and a way to disable this altogether
    private name: string;
    private showName: boolean;
    private parseDetails: boolean;

    private separator = "&";

    constructor(parseDetails?: boolean, name?: string, defaultSeparator?: string) {
        this.parseDetails = (parseDetails == undefined) ? false: parseDetails;
        this.name = name || "";
        this.showName = (name == undefined) ? false : true;
    }

    public changeIfSeeName(showName: boolean): void {
        this.showName = (this.name == undefined) ? false : showName;
    }

    public changeDefaultSeparator(newSeparator: string): void {
        this.separator = newSeparator;
    }

    public parseData(data: string): string {
        let splitData = data.split(this.separator);
        if (splitData.length == 1) {
            return data;
        }

        let out = "";
        let idx = 0;
        for (const data2 of splitData) {
            if (idx++ == 0) {
                continue;
            }

            out += this.parseDetail(data2.charAt(0)) + data2.substring(1);
        }

        return out + "\u001b[0m";
    }

    public info(data: string): void {
        console.log(this.parseData(data));
    }

    public trace(data: string): void {
        console.trace(this.parseData(data));
    }

    public error(data: string): void {
        console.error("\u001b[31m" + this.parseData(data));
    }

    public warn(data: string): void {
        console.warn("\u001b[33m" + this.parseData(data));
    }

    /*
        Details
        &b, &r, &g, &y, &l, &m, &c, &w, &d: foreground colors
        &B, &R, &G, &Y, &L, &M, &C, &W, &D: background colors
        &q: clear details
        &u: underline
        &o: bold
        &s: strike-through
        &i: italics
        &&: and symbol
    */
    private parseDetail(detail: string): string {
        switch (detail) {
            case "u":
                return "\u001b[4m"; // Underline
            case "o":
                return "\u001b[2m"; // Bold
            case "s":
                return "\u001b[9m"; // strike-through
            case "i":
                return "\u001b[3m"; // italics
            case "&":
                return "&"; // literal
            case "q":
                return "\u001b[0m";
            case "b":
                return "\u001b[30m"; // black
            case "r":
                return "\u001b[31m"; // red
            case "g":
                return "\u001b[32m"; // green
            case "y":
                return "\u001b[33m"; // yellow
            case "l":
                return "\u001b[34m"; // blue
            case "m":
                return "\u001b[35m"; // magenta
            case "c":
                return "\u001b[36m"; // cyan
            case "w":
                return "\u001b[37m"; // white
            case "d": 
                return "\u001b[39m"; // default
            case "B":
                return "\u001b[40m";
            case "R":
                return "\u001b[41m";
            case "G":
                return "\u001b[42m";
            case "Y":
                return "\u001b[43m";
            case "L":
                return "\u001b[44m";
            case "M":
                return "\u001b[45m";
            case "C":
                return "\u001b[46m";
            case "W":
                return "\u001b[47m";
            case "D": 
                return "\u001b[49m";
        }

        return "";
    }
}
