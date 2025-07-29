import fs from "fs";
import { formatStringMinecraft } from "./dto/Text.js";
import { Logger } from "./logging/Logger.js";

export default class LanguageManager {
    private static en_us: Record<string, string>;

    public static initialize() {
        this.en_us = JSON.parse(fs.readFileSync("./data/minecraftStringKeys.json").toString());
        const loaded = Object.keys(this.en_us).length;
        Logger.info(`Language manager loaded ${loaded} keys`);
    }

    public static fromKey(key: string): string | undefined {
        Logger.detail(`fromKey(${key}) returned '${this.en_us[key]}'`);
        return this.en_us[key];
    }

    public static formatterFromKey(key: string) {
        Logger.detail(`formatterFromKey(${key}) returned '${this.en_us[key]}'`);
        return this.en_us[key];
    }

    public static stringFromKey(key: string, ...values: string[]) {
        const formatted = formatStringMinecraft(this.en_us[key], ...values);
        Logger.detail(`stringFromKey(${key}, ${values.toString()}) returned '${formatted}'`);
        return formatted;
    }

    public static entityStringFromPartial(key: string) {
        let ret;
        if (key.startsWith("minecraft:")) {
            key = key.replace("minecraft:", "");
            ret = `minecraft.entity.${key}`;
        } else {
            ret = `minecraft.entity.${key}`;
        }
        Logger.detail(`entityStringFromPartial(${key}) returned '${ret}'`);
        return ret;
    }
}
