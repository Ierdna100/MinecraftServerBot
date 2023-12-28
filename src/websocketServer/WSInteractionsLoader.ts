import fs from "fs";
import { BaseWSInteraction } from "../dto/BaseWSInteraction.js";

export class WSInteractionsLoader {
    public static interactions: BaseWSInteraction[] = [];

    public async loadInteractionReplies() {
        WSInteractionsLoader.interactions = [];

        const endpointFileNames = fs.readdirSync("./build/websocketServer/interactionHandlers/");

        for (const endpointFileName of endpointFileNames) {
            let interactionCtor: { default: new () => BaseWSInteraction } = await import(
                `./interactionHandlers/${endpointFileName}`
            );

            WSInteractionsLoader.interactions.push(new interactionCtor.default());
        }
    }
}
