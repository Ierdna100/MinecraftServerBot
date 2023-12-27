import { ObjectId } from 'mongodb';
import { UUID } from './UUID';

interface Mongo_Base {
    id?: ObjectId, // May be missing
    uploadTimestamp: Date,
    lastEditTimestamp?: Date // Optionally not present if never edited
}

export interface Game extends Mongo_Base {
    name: string;
    price: number;
    category: string;
}

export interface Message extends Mongo_Base {
    message_timestamp: Date
    message: string;
    sender: UUID;
}
