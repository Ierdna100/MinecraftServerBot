import { TimeEventType } from "./TimeEventType.js";

export interface PlaySession {
    length: number | undefined;
    start: Date;
    end: Date | undefined;
    startType: TimeEventType;
    endType: TimeEventType | undefined;
}
