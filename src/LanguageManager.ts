import fs from "fs";
import { formatStringMinecraft } from "./dto/Text.js";

export default class LanguageManager {
    private static en_us: Record<string, string>;

    public static initialize() {
        this.en_us = JSON.parse(fs.readFileSync("./data/minecraftStringKeys.json").toString());
    }

    public static fromKey(key: string): string | undefined {
        return this.en_us[key];
    }

    public static formatterFromKey(key: string) {
        return this.en_us[key];
    }

    public static stringFromKey(key: string, ...values: string[]) {
        return formatStringMinecraft(this.en_us[key], ...values);
    }

    public static entityStringFromPartial(key: string) {
        if (key.startsWith("minecraft:")) {
            key = key.replace("minecraft:", "");
            return `minecraft.entity.${key}`;
        } else {
            return `minecraft.entity.${key}`;
        }
    }
}
