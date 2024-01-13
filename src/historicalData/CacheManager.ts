import fs from "fs";
import { Application } from "../Application.js";

export class CacheManager {
    public static async generateCache(): Promise<void> {
        const cacheDir = fs.readdirSync("./cache");
        for (const file of cacheDir) {
            // console.log(`Unlinking file from cache with name: ${file}`);
            fs.unlinkSync(`./cache/${file}`);
        }

        fs.writeFileSync(
            "./cache/advancementData",
            JSON.stringify(await Application.instance.collections.advancements.find().toArray())
        );

        fs.writeFileSync(
            "./cache/deathData",
            JSON.stringify(await Application.instance.collections.deaths.find().toArray())
        );

        fs.writeFileSync(
            "./cache/joinsData",
            JSON.stringify(await Application.instance.collections.joins.find().toArray())
        );

        fs.writeFileSync(
            "./cache/leavesData",
            JSON.stringify(await Application.instance.collections.leaves.find().toArray())
        );

        fs.writeFileSync(
            "./cache/stopData",
            JSON.stringify(await Application.instance.collections.stops.find().toArray())
        );
    }
}
