import { TimeEventType } from "./TimeEventType.js";

export interface TimePlayedEvent {
    uuid?: string;
    timestamp: Date;
    type: TimeEventType;
}
