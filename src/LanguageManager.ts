import fs from "fs";
import { formatStringMinecraft } from "./dto/Text.js";
import { Logger } from "./logging/Logger.js";

export type TranslationKey = FormatterKey | EntityKey;
export type FormatterKey = string;
export type EntityKey = `entity.minecraft.${string}`;
export type CommandKey = `${string}:${string}`;

export default class LanguageManager {
    private static en_us: Record<TranslationKey, string>;

    public static initialize() {
        this.en_us = JSON.parse(fs.readFileSync("./data/minecraftStringKeys.json").toString());
        const loaded = Object.keys(this.en_us).length;
        Logger.info(`Language manager loaded ${loaded} keys`);
    }

    public static fromKey(key: string): TranslationKey | undefined {
        Logger.detail(`fromKey(${key}) returned '${this.en_us[key]}'`);
        return this.en_us[key];
    }

    public static formatterFromKey(key: string): FormatterKey {
        Logger.detail(`formatterFromKey(${key}) returned '${this.en_us[key]}'`);
        return this.en_us[key];
    }

    public static stringFromKey(key: TranslationKey, ...values: string[]): string {
        const formatted = formatStringMinecraft(this.en_us[key], ...values);
        Logger.detail(`stringFromKey(${key}, ${values.toString()}) returned '${formatted}'`);
        return formatted;
    }

    public static entityStringFromPartial(key: string): EntityKey {
        let ret: EntityKey;
        if (key.startsWith("minecraft:")) {
            key = key.replace("minecraft:", "");
        } else {
            ret = `entity.minecraft.${key}`;
        }
        ret = `entity.minecraft.${key}`;
        Logger.detail(`entityStringFromPartial(${key}) returned '${ret}'`);
        return ret;
    }
}
