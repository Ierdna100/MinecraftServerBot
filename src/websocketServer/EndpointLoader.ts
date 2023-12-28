import fs from "fs";
import { BaseWSInteraction } from "../dto/BaseWSInteraction.js";

export class WSInteractionsLoader {
    public static interactions: BaseWSInteraction[] = [];

    public async loadInteractionReplies() {
        WSInteractionsLoader.interactions = [];

        const endpointFileNames = fs.readdirSync("./build/websocketServer/interactions/");

        for (const endpointFileName of endpointFileNames) {
            let interactionCtor: { default: new () => BaseWSInteraction } = await import(
                `./interactions/${endpointFileName}`
            );

            WSInteractionsLoader.interactions.push(new interactionCtor.default());
        }
    }
}
